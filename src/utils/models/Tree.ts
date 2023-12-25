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

  private _uniqueId: string

  constructor(options?: { data?: Data }) {
    this._data = options?.data
    this._root = this
    this._uniqueId = Math.random().toString() + this._depth
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

    this._children.push(child)

    // 更新子节点的根节点和深度
    this.eachChild((child) => {
      child._root = this._root // 更新子节点的根节点
      child._depth = child._parent!._depth + 1 // 更新子节点的深度
    })
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
}
