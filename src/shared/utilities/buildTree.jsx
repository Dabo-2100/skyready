export const buildTree = (items, fieldName = "package_id", parentId = null) => {
    let final = [];
    final = items.filter(item => item.parent_id === parentId);
    if (final.length < items.length) {
        final = final.map(item => ({ ...item, children: buildTree(items, fieldName, item[`${fieldName}`]) }));
    }
    return final;
};