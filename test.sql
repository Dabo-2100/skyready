SELECT
  task_name,
  CONCAT (
    SUBSTRING_INDEX (wpt.task_name, ".", 1),".",
  COALESCE(SUBSTRING_INDEX (NULLIF(SUBSTRING_INDEX (task_name, '.', 2),SUBSTRING_INDEX (wpt.task_name, ".", 1)),".",-1),'0'),
    ".",
    COALESCE(
      SUBSTRING_INDEX (
        NULLIF(
          SUBSTRING_INDEX (task_name, '.', 3),
          SUBSTRING_INDEX (wpt.task_name, ".", 2)
        ),
        ".",
        -1
      ),
      '0'
    ),
    ".",
    COALESCE(
      SUBSTRING_INDEX (
        NULLIF(
          SUBSTRING_INDEX (task_name, '.', 4),
          SUBSTRING_INDEX (wpt.task_name, ".", 3)
        ),
        ".",
        -1
      ),
      '0'
    )
  ) As task_weight
FROM
  o_sb_tasks wpt
WHERE
  wpt.task_name LIKE '%3.6.15%';

-- UPDATE `o_tasks_x_zones`
SELECT
  SUBSTRING_INDEX (otx.part_name, '|', 1),
  SUBSTRING_INDEX (otx.part_name, '|', -1)
  -- (SELECT package_id FROM work_packages WHERE package_name = SUBSTRING_INDEX(otx.part_name, '|', 1) ) 
FROM
  `o_tasks_x_zones` otx;


  SELECT 
otx.*,
  SUBSTRING_INDEX (otx.part_name, '|', 1),
  SUBSTRING_INDEX (otx.part_name, '|', -1),
  
  (
      SELECT wp.package_id FROM work_packages wp 
      WHERE package_name = SUBSTRING_INDEX (otx.part_name, '|', -1)
      AND parent_id = (
          SELECT wp2.package_id FROM work_packages wp2 
          WHERE wp2.package_name = SUBSTRING_INDEX (otx.part_name, '|', 1)
      ) 
  ) As parent_id
FROM
  `o_tasks_x_zones` otx;



  BEGIN
    DECLARE package_id INT;
    DECLARE log_id INT;
    
    -- Get the package_id of the inserted task from work_package_tasks
    SELECT wpt.package_id
    INTO package_id
    FROM work_package_tasks wpt
    WHERE wpt.task_id = NEW.task_id;
    
    -- Get the log_id 
    SELECT pwp.log_id
    INTO log_id
    FROM project_work_packages pwp
    WHERE pwp.work_package_id = package_id AND pwp.project_id = NEW.project_id;
    -- UPDATE PWP
     UPDATE project_work_packages pwp
     SET pwp.work_package_progress = get_wp_progress(log_id) 
     WHERE pwp.log_id = log_id;
END


CREATE TRIGGER `after_insert_project` AFTER INSERT ON `app_projects`
 FOR EACH ROW BEGIN
    INSERT INTO project_progress_tracker (project_id, day_date, old_progress, new_progress) 
    VALUES (NEW.project_id, CURDATE(), 0, 0);
END

CREATE TRIGGER `after_insert_wp_task` AFTER INSERT ON `work_package_tasks`
 FOR EACH ROW BEGIN
    INSERT INTO project_tasks (task_id, project_id, status_id, task_start_at, task_end_at, task_progress, is_active)
    SELECT NEW.task_id, pwp.project_id, 1, NULL, NULL, 0, TRUE
    FROM project_work_packages pwp
    WHERE pwp.work_package_id = NEW.package_id;
   
    UPDATE project_work_packages pwp2
    SET pwp2.work_package_progress = get_wp_progress(pwp2.log_id);

    UPDATE work_packages
    SET package_duration = (
        SELECT COALESCE(SUM(task_duration), 0)
        FROM work_package_tasks
        WHERE package_id = NEW.package_id
    )
    WHERE package_id = NEW.package_id;
END


CREATE TRIGGER `after_update_task` AFTER UPDATE ON `work_package_tasks`
 FOR EACH ROW BEGIN
    -- Check if the task_duration was modified
    IF NEW.task_duration != OLD.task_duration THEN
        -- Update the package_duration in work_packages by summing task durations for the related package
        UPDATE work_packages wp
        SET wp.package_duration = (
            SELECT COALESCE(SUM(task_duration), 0)
            FROM work_package_tasks
            WHERE package_id = NEW.package_id
        )
        WHERE wp.package_id = NEW.package_id;

        -- Update the work_package_progress in project_work_packages using get_wp_progress function
        UPDATE project_work_packages
        SET work_package_progress = get_wp_progress(log_id)
        WHERE work_package_id = NEW.package_id;

        UPDATE app_projects ap
        JOIN project_work_packages pwp ON pwp.project_id = ap.project_id
        SET ap.project_progress = get_project_progress(ap.project_id)
        WHERE pwp.work_package_id = NEW.package_id;
    END IF;
END

CREATE TRIGGER `before_insert_task` BEFORE INSERT ON `work_package_tasks`
 FOR EACH ROW BEGIN
    IF NEW.task_order IS NULL OR NEW.task_order = 0 THEN
        SET NEW.task_order = (
            SELECT IFNULL(MAX(task_order), 0) + 1 
            FROM work_package_tasks 
            WHERE package_id = NEW.package_id
        ),
        NEW.task_weight = calculate_task_weight(NEW.task_name);
    END IF;
END

CREATE TRIGGER `before_update_project_task` BEFORE UPDATE ON `project_tasks`
 FOR EACH ROW BEGIN
    -- Check if the new task progress is 100
    IF NEW.task_progress = 100 AND NEW.is_active = 1 THEN
        SET NEW.status_id = 4;
    END IF;
END

CREATE TRIGGER `before_update_task` BEFORE UPDATE ON `work_package_tasks`
 FOR EACH ROW SET NEW.task_weight = calculate_task_weight(NEW.task_name)
