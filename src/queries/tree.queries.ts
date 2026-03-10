export const GET_TREE_RECURSIVE = `
  WITH RECURSIVE tree AS (
    SELECT id, label, "parentId"
    FROM "TreeNode"
    WHERE "parentId" IS NULL

    UNION ALL

    SELECT n.id, n.label, n."parentId"
    FROM "TreeNode" n
    INNER JOIN tree t ON n."parentId" = t.id
  )
  SELECT * FROM tree;
  `