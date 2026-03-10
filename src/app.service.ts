import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateNodeDto } from './dto/create-node.dto'
import { TreeNodeWithChildren } from './types/tree-node.type'

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

    const nodes = await this.prisma.treeNode.findMany()

    const map = new Map<number, TreeNodeWithChildren>()
    const roots: TreeNodeWithChildren[] = []

    // Map gives us constant time lookup
    nodes.forEach(node => {
      map.set(node.id, { ...node, children: [] })
    })

    // Connect parent to children or add to root
    // Guarantee object presence because we queried them
    nodes.forEach(node => {
      if (node.parentId) {
        map.get(node.parentId)!.children.push(map.get(node.id)!)
      } else {
        roots.push(map.get(node.id)!)
      }
    })

    return roots
  }
}