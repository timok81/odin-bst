class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = array;
    this.root = this.buildTree(array, 0, array.length - 1);
  }

  //Builds tree
  buildTree(array, start, end) {
    if (start > end) return null;

    let mid = Math.floor((start + end) / 2);

    let node = new Node(array[mid]);

    node.left = this.buildTree(array, start, mid - 1);
    node.right = this.buildTree(array, mid + 1, end);

    return node;
  }

  //Prints tree in console
  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  //Inserts new element in to tree
  insert(value, node = this.root) {
    if (node === null) {
      return new Node(value);
    }
    if (node.value === value) {
      return node;
    }
    if (value < node.value) {
      node.left = this.insert(value, node.left);
    } else if (value > node.value) {
      node.right = this.insert(value, node.right);
    }
    return node;
  }

  //deletes element from tree
  deleteItem(searchValue, node = this.root) {
    let current = node;
    let parent = null;

    //Search for value, this loops will find target node and its parent
    while (current != null && current.value != searchValue) {
      parent = current;
      if (searchValue > current.value) {
        current = current.right;
      } else {
        current = current.left;
      }
    }
    //If value doesn't exist
    if (current === null) return console.log("Value not found");

    //If target node has no children
    if (current.left === null && current.right === null) {
      if (current === parent.left) parent.left = null;
      else parent.right = null;
      return;
    }

    //If target node only has one child
    if (current.left === null || current.right === null) {
      let newTarget =
        current.left === null ? current.right : current.left;

      if (current === parent.left) parent.left = newTarget;
      else parent.right = newTarget;
      return;
    }
    //If target node has two children
    else if (current.left !== null && current.right !== null) {
      let temp = current.right;
      let tempParent = null;
      //Find a replacement node
      while (temp.left != null) {
        tempParent = temp;
        temp = temp.left;
      }

      //If left side of temp had something
      if (tempParent != null) tempParent.left = temp.right;
      //if left side had nothing
      else current.right = temp.right;

      current.value = temp.value;
    }
  }

  //Finds a node with given value
  find(searchValue, node = this.root) {
    let targetNode = node;

    //Search value
    while (targetNode != null && targetNode.value != searchValue) {
      if (searchValue > targetNode.value) {
        targetNode = targetNode.right;
      } else {
        targetNode = targetNode.left;
      }
    }
    if (targetNode === null) return console.log("Value not found");

    return targetNode;
  }

  //Prints values without sorting them to levels, this is the actual solution
  levelOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback function expected");

    let queue = [node];

    while (queue.length > 0) {
      node = queue.shift();
      callback(node);
      if (node.left != null) queue.push(node.left);
      if (node.right != null) queue.push(node.right);
    }
  }

  //Same as above, but values are sorted in sub-arrays representing levels
  levelOrderSorted(node = this.root) {
    let queue = [node];
    let result = [];

    while (queue.length > 0) {
      let currentLevel = [];
      let levelSize = queue.length;

      for (let i = 0; i < levelSize; i++) {
        node = queue.shift();
        currentLevel.push(node.value);

        if (node.left != null) queue.push(node.left);
        if (node.right != null) queue.push(node.right);
      }
      result.push(currentLevel);
    }
    return result;
  }

  //Recursive version
  levelOrderRecursive(node = this.root, array = []) {
    function traverse(node, level) {
      if (!array[level]) array[level] = [];
      array[level].push(node.value);

      if (node.left) traverse(node.left, level + 1);
      if (node.right) traverse(node.right, level + 1);
    }
    traverse(node, 0);
    return array;
  }

  //Traversal methods
  inOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback function expected");
    if (node == null) return;
    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  preOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback function expected");
    if (node == null) return;
    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  postOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback function expected");
    if (node == null) return;
    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  //Returns height of given node
  height(node = this.root) {
    if (node === null) return -1;
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  //Returns depth of given node
  depth(targetNode, node = this.root, depth = 0) {
    if (node === null) return -1;

    if (node.value === targetNode.value) return depth;

    let leftDepth = this.depth(targetNode, node.left, depth + 1);
    if (leftDepth != -1) return leftDepth;
    let rightDepth = this.depth(targetNode, node.right, depth + 1);
    return rightDepth;
  }

  //Naive inefficient balance check
  /*
  isBalancedTest(node = this.root) {
    if (node === null) return true;

    const leftHeight = this.height(node.left) + 1;
    const rightHeight = this.height(node.right) + 1;

    if (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalancedTest(node.left) === true &&
      this.isBalancedTest(node.right) === true
    ) {
      return true;
    }
    return false;
  }
*/

  //Determines whether the tree is balanced
  isBalanced(node = this.root) {
    //Checks height of each node, returns -1 if any node is unbalanced
    function checkBalance(node) {
      if (node === null) return 0;

      let lh = checkBalance(node.left);
      if (lh === -1) return -1;
      let rh = checkBalance(node.right);
      if (rh === -1) return -1;

      if (Math.abs(lh - rh) > 1) return -1;
      else return Math.max(lh, rh) + 1;
    }
    if (checkBalance(node) > 0) return true;
    else return false;
  }

  //Alternative balance check
  /*
  isBalanced(node = this.root) {
    
    function checkBalance(node) {
      if (node === null) return true;

      if (Math.abs(this.depth(node.left) - this.depth(node.right)) > 1)
        return false;
      return checkBalance(node.left) && checkBalance(node.right);
    }
    return checkBalance(node);
  }
    */

  rebalance() {
    let newArray = [];
    this.inOrder((node) => {
      newArray.push(node.value);
    });

    this.root = this.buildTree(newArray, 0, newArray.length - 1);
  }
}

//Removes duplicate elements and sorts in ascending order
function sortArray(array) {
  array = array.filter((value, index) => array.indexOf(value) === index);
  array.sort((a, b) => a - b);
  console.log("Sorted array:" + array);
  return array;
}

function createRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function createRandomArray() {
  let array = [];
  while (array.length < 40) {
    array.push(createRandomNumber());
  }
  return array;
}

//const array1 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

//const myTree = new Tree(sortArray(array1));
const myTreeB = new Tree(sortArray(createRandomArray()));
