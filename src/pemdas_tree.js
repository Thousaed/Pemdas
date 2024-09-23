import Node from './tree_node.js'
import * as util from '../utils/helpers.js';

export default class PemdasTree {
  #shouldUpdateCurrent = true
  #precedence = { 
    '+': 1, 
    '-': 1, 
    '*': 2, 
    '/': 2, 
    '^': 3 
  }
  
  constructor() {
    this.list = null
    this.current = null;
  }
  
  insert(token) {
    if (! util.isValidToken(token)) {
      throw Error('Token not valid')
    }
    
    if (! this.list) {
      let node = new Node()
      this.list = node
      this.current = this.list
    }
    
    if (token.type == 'number') {
      if (! this.current.left) {
        this.current.left = token.value;
        return
      }
      
      if (!this.current.value || this.current.right) {
        throw Error('Unexpected token. operator expected')
      }
      
      this.current.right = token.value;
      if (this.#shouldUpdateCurrent) {
        this.current = this.list
      }
    } else {
      if (!this.current.left || (!this.current.right && this.current.value)) {
        throw Error('Unexpected token. number expected')
      }
      
      if (! this.current.value) {
        this.current.value = token.value
        return
      }
      
      let node = new Node(token.value)
      if (this.#precedence[this.current.value] >= this.#precedence[token.value]) {
        node.left = this.current;
        this.current = node
        this.list = this.current
        return
      }
      
      node.left = this.current.right
      this.current.right = node
      this.current = node
      this.#shouldUpdateCurrent = true
    }
  }
  
  evaluate() {
    return (function cls (node) {
      if ('number' == typeof node) 
        return node
      
      if (! node)
        return 0
          
      switch (node.value) {
        case '^':
          return Math.pow(cls(node.left), cls(node.right))
          break;
        
        case '-':
          return cls(node.left) - cls(node.right)
          break;
        
        case '*':
          return cls(node.left) * cls(node.right)
          break;
        
        case '/':
          return cls(node.left) / cls(node.right)
          break;
        
        default:
          return cls(node.left) + cls(node.right)
          
      }
    }(this.list));
  }
};

