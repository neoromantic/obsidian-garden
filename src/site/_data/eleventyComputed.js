import { getGraph } from '../../helpers/linkUtils.js';
import { getFileTree } from '../../helpers/filetreeUtils.js';
import { userComputed } from '../../helpers/userUtils.js';

export default {
  graph: (data) => getGraph(data),
  filetree: (data) => getFileTree(data),
  userComputed: (data) => userComputed(data)
};
