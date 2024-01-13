export class Tree<Data extends any = any> {
  /** 节点附带的数据 */
  private _data: Data | undefined
  /** 节点的子节点列表 */
  private _children: Tree<Data>[] = []
  /** 父节点 */
  private _parent: Tree<Data> | undefined = undefined
  /** 根节点 */
  private _root: Tree<Data> | undefined = undefined
  /** 节点的深度 */
  private _depth: number = 0
  /** 节点的唯一标识 */
  private _uniqueId: string
  /** 深度映射表 */
  private _depthMap: Map<number, Set<Tree<Data>>> = new Map()

  constructor(options?: { data?: Data }) {
    this._data = options?.data
    this._root = this
    this._uniqueId = Math.random().toString() + this._depth
  }

  get depthMap() {
    return this._depthMap
  }

  get uniqueId() {
    return this._uniqueId
  }

  get parent() {
    return this._parent
  }

  get root() {
    return this._root
  }

  get depth() {
    return this._depth
  }

  get data() {
    return this._data
  }

  get children() {
    return this._children
  }

  /** 添加子节点 */
  appendChild(child: Tree<Data>) {
    child._parent = this
    child._root = this._root
    child._depth = this._depth + 1

    const depthSet = this.root?._depthMap.get(child._depth) ?? new Set()
    depthSet.add(child)
    this.root?._depthMap.set(child._depth, depthSet)

    this._children.push(child)

    // 更新子节点的根节点和深度
    this.eachChild((child) => {
      child._root = this._root // 更新子节点的根节点
      child._depth = child._parent!._depth + 1 // 更新子节点的深度

      const depthSet = this.root?._depthMap.get(child._depth) ?? new Set()
      depthSet.add(child)
      this.root?._depthMap.set(child._depth, depthSet)
    })
  }

  /** 遍历祖先节点 */
  eachAncestor(callback: (child: Tree<Data>) => void) {
    let current: Tree<Data> | undefined = this
    const ancestors = []

    while ((current = current.parent)) {
      ancestors.push(current)
      callback(current)
    }

    return ancestors
  }

  /** 遍历子节点 */
  eachChild(callback: (child: Tree<Data>) => void, options?: { method: 'deep' | 'breadth' }) {
    const method = options?.method ?? 'deep'

    const tasks: Tree<Data>[] = [] // 待处理的节点
    let current: Tree<Data> | undefined = undefined // 当前正在处理的节点

    tasks.push(...this._children) // 将当前节点的子节点添加到待处理的节点中

    while ((current = tasks.shift())) {
      callback(current)

      if (method === 'deep') {
        tasks.unshift(...current._children)
      } else if (method === 'breadth') {
        tasks.push(...current._children)
      }
    }
  }

  /** 判断是否是根节点 */
  isRoot(): this is { root: Tree<Data> } {
    return this === this._root
  }

  /** 获取叶子结点 */
  getLeaf() {
    let leaf: undefined | Tree<Data> = undefined

    this.root?.eachChild((child) => {
      if (child.children.length !== 0) return
      if (!leaf) return (leaf = child)
      if (child.depth > leaf.depth) leaf = child
    })

    return leaf
  }

  /** 获取最大深度 */
  getMaxDepth() {
    let maxDepth = 0

    this.root?.eachChild((child) => {
      if (child.depth > maxDepth) maxDepth = child.depth
    })

    return maxDepth
  }
}
