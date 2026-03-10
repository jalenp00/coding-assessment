export type TreeNodeWithChildren = {
  id: number
  label: string
  parentId: number | null
  children: TreeNodeWithChildren[]
}