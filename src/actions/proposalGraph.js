import { APP_REMOVE_NODE, APP_TOGGLE_NAME, APP_UPDATE_PATHS, APP_CHANGE_OFFSET } from '../constants/index'

export function removeNode(udid) {
  return {
    type: APP_REMOVE_NODE,
    udid: udid
  };
}

export function toggleName(index) {
  return {
    type: APP_TOGGLE_NAME,
    index: index
  };
}

export function updatePaths() {
  return {
    type: APP_UPDATE_PATHS
  };
}

export function changeOffset(name) {
  return {
    type: APP_CHANGE_OFFSET,
    name: name
  };
}
