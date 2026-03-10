// defines api output
export type TreeNodeWithChildren = {
  id: number
  label: string
  parentId: number | null
  children: TreeNodeWithChildren[]
}

// defines db output
export type TreeRow = {
  id: number
  label: string
  parentId: number | null
}