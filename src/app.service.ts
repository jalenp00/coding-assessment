import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateNodeDto } from './dto/create-node.dto'
import { TreeNodeWithChildren, TreeRow } from './types/tree-node.type'
import { GET_TREE_RECURSIVE } from './queries/tree.queries'

@Injectable()
export class AppService {

  constructor(private prisma: PrismaService) {}

  /*
    Creates Node
    Parameters: { "label": "...", "parentId?": number}
    Returns: created node
  */
  async createNode(dto: CreateNodeDto) {

    if (!dto) {
      throw new Error('DTO is undefined')
    }
    
    // If new node has a parentId, it is a child node -> get parent node
    if (dto.parentId) {
      const parent = await this.prisma.treeNode.findUnique({
        where: { id: dto.parentId }
      })

      // Throw an error if no parent exists
      if (!parent) {
        throw new NotFoundException('Parent node not found')
      }
    }

    return this.prisma.treeNode.create({
      data: {
        label: dto.label,
        parentId: dto.parentId
      }
    })
  }

  /*
    Gets all trees
    Returns: root nodes with children attached
  */
  async getTrees(): Promise<TreeNodeWithChildren[]> {

  const rows = await this.prisma.$queryRawUnsafe<TreeRow[]>(GET_TREE_RECURSIVE)

    const map = new Map<number, TreeNodeWithChildren>()
    const roots: TreeNodeWithChildren[] = []

    // Map gives us constant time lookup
    rows.forEach(node => {
      map.set(node.id, { ...node, children: [] })
    })

    // adds current node to parent if it has one or adds it as a root
    for (const node of rows) {
      const current = map.get(node.id)

      if (!current) { continue }

      if (node.parentId === null) {
        roots.push(current)
      } else {
        const parent = map.get(node.parentId)

        if (parent) {
          parent.children.push(current)
        }
      }
    }

    return roots
  }
}