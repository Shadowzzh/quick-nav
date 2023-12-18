export class Tree<Data extends any = any> {
  /** 节点附带的数据 */
  private data: Data | undefined
  /** 节点的子节点列表 */
  private children: Tree<Data>[] = []
  /** 父节点 */
  private parent: Tree<Data> | undefined = undefined
  /** 根节点 */
  private root: Tree<Data> | undefined = undefined
  /** 节点的深度 */
  private depth: number = 0

  constructor(options?: { data?: Data }) {
    this.data = options?.data
    this.root = this
  }

  get getParent() {
    return this.parent
  }

  get getRoot() {
    return this.root
  }

  get getDepth() {
    return this.depth
  }

  get getData() {
    return this.data
  }

  get getChildren() {
    return this.children
  }

  /** 添加子节点 */
  appendChild(child: Tree<Data>) {
    child.parent = this
    child.root = this.root
    child.depth = this.depth + 1

    this.children.push(child)

    // 更新子节点的根节点和深度
    this.eachChild((child) => {
      child.root = this.root // 更新子节点的根节点
      child.depth = child.parent!.depth + 1 // 更新子节点的深度
    })
  }

  /** 遍历子节点 */
  eachChild(callback: (child: Tree<Data>) => void) {
    const tasks: Tree<Data>[] = [] // 待处理的节点
    let current: Tree<Data> | undefined = undefined // 当前正在处理的节点

    tasks.push(...this.children) // 将当前节点的子节点添加到待处理的节点中

    while ((current = tasks.shift())) {
      callback(current)
      tasks.push(...current.children)
    }
  }

  /** 判断是否是根节点 */
  isRoot(): this is { getRoot: Tree<Data> } {
    return this === this.root
  }
}
