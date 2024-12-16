import { reportRepo } from "./reportRepo";

export default function useReport() {
    const getData = async (serverUrl, token) => {
        let data = await reportRepo.all_data(serverUrl, token);
        return data.data;
    }

    const groupPackages = (data) => {
        let final = data.reduce((acc, pkg) => {
            const parentId = pkg.parent_id;
            if (!acc[parentId]) {
                acc[parentId] = {
                    parent_id: parentId,
                    parent_name: pkg.parent_name,
                    parent_package_duration: 0, // Total duration of the parent package
                    parent_issued_duration: 0,
                    done_parent_progress: 0, // To be calculated
                    children: [] // Array for child packages
                };
            }
            // Add the duration to the parent's total duration
            acc[parentId].parent_package_duration += pkg.package_duration;
            acc[parentId].parent_issued_duration += pkg.package_issued_duration;
            // Add the package to the children array
            acc[parentId].children.push(pkg);
            return acc;
        }, {});

        Object.values(final).forEach(group => {
            let totalProgress = 0;
            group.children.forEach(pkg => {
                if (pkg.package_progress !== null) {
                    // Calculate the progress contribution of each child
                    totalProgress += (pkg.package_progress / 100) * pkg.package_duration;
                }
            });
            // Calculate the overall progress for the parent package
            group.done_parent_progress = ((totalProgress / group.parent_package_duration) * 100).toFixed(2);
        });
        const result = Object.values(final);
        return result;
    }

    return { getData, groupPackages }
}