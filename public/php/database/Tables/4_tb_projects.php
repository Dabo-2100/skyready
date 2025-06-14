<?php
$statements = array_merge($statements, [
    'CREATE TABLE IF NOT EXISTS project_status( 
        status_id               INT(20) AUTO_INCREMENT PRIMARY KEY,
        affect_progress         BOOLEAN NOT NULL,
        act_like_done           BOOLEAN DEFAULT False,
        status_name             VARCHAR(255) NOT NULL,      
        status_color_code       VARCHAR(255) NULL,
        status_bg_code          VARCHAR(255) NULL,
        is_active               BOOLEAN DEFAULT TRUE,
        created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update             TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (status_name)
    )',

    'CREATE TABLE IF NOT EXISTS project_tags( 
        tag_id            INT(20) AUTO_INCREMENT PRIMARY KEY,
        tag_name          VARCHAR(255) NOT NULL,
        is_active         BOOLEAN DEFAULT TRUE,
        created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (tag_name)
    )',

    'CREATE TABLE IF NOT EXISTS app_projects ( 
        project_id                      INT(20) AUTO_INCREMENT PRIMARY KEY,
        project_name                    VARCHAR(255) NOT NULL,
        project_desc                    VARCHAR(255) NULL,
        project_start_date              DATE NULL,
        project_due_date                DATE NULL,
        status_id                       INT DEFAULT 1,
        FOREIGN KEY (status_id) REFERENCES project_status(status_id),
        project_duration                FLOAT(20) NULL,
        active_hours                    FLOAT(20) NULL,
        project_progress                FLOAT(20) DEFAULT 0,
        aircraft_id                     INT,
        FOREIGN KEY (aircraft_id) REFERENCES app_aircraft(aircraft_id),
        work_start_at                   VARCHAR(255) NULL,
        work_end_at                     VARCHAR(255) NULL,
        working_days                    VARCHAR(255) NULL,
        created_at                      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update                     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active                       BOOLEAN DEFAULT TRUE,
        UNIQUE (project_name,aircraft_id)
    )',

    'CREATE TABLE IF NOT EXISTS project_work_packages( 
        log_id                  INT(20) AUTO_INCREMENT PRIMARY KEY,
        work_package_id         INT,
        FOREIGN KEY (work_package_id) REFERENCES work_packages(package_id),
        project_id              INT,
        FOREIGN KEY (project_id) REFERENCES app_projects(project_id),
        status_id               INT,
        FOREIGN KEY (status_id) REFERENCES project_status(status_id),
        work_package_progress   FLOAT(20) DEFAULT 0,
        is_active               BOOLEAN DEFAULT TRUE,
        created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update             TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (project_id , work_package_id)
    )',

    'CREATE TABLE IF NOT EXISTS project_tasks( 
        log_id                  INT(20) AUTO_INCREMENT PRIMARY KEY,
        task_id                 INT,
        FOREIGN KEY (task_id) REFERENCES work_package_tasks(task_id),              
        project_id              INT,
        FOREIGN KEY (project_id) REFERENCES app_projects(project_id), 
        status_id               INT,
        FOREIGN KEY (status_id) REFERENCES project_status(status_id),
        task_start_at           VARCHAR(255) NULL,
        task_end_at             VARCHAR(255) NULL,
        task_progress           FLOAT(20) DEFAULT 0,
        is_active               BOOLEAN DEFAULT TRUE,
        created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update             TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (project_id , task_id)
    )',

    'CREATE TABLE IF NOT EXISTS task_comments ( 
        comment_id          INT(20) AUTO_INCREMENT PRIMARY KEY,
        log_id              INT,
        FOREIGN KEY (log_id) REFERENCES project_tasks(log_id),
        comment_content     VARCHAR(255) NOT NULL,
        comment_date        DATE NULL,
        comment_by          INT,
        FOREIGN KEY (comment_by) REFERENCES app_users(user_id),
        parent_id           INT,
        FOREIGN KEY (parent_id) REFERENCES task_comments(comment_id),
        created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )',

    'CREATE TABLE IF NOT EXISTS task_users ( 
        log_id                      INT(20) AUTO_INCREMENT PRIMARY KEY,
        task_log_id                 INT,
        FOREIGN KEY (task_log_id) REFERENCES project_tasks(log_id),
        user_id                     INT,
        FOREIGN KEY (user_id) REFERENCES app_users(user_id),
        created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active                   BOOLEAN DEFAULT TRUE,
        UNIQUE (task_log_id,user_id)
    )',
]);
