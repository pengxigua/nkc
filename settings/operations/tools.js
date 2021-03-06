module.exports = {
  GET: 'visitToolsList',
  open: {
    PARAMETER: {
      GET: 'visitTool'
    }
  },
  upload: {
    POST: 'uploadTool'
  },
  update: {
    POST: 'updateTool'
  },
  delete: {
    DELETE: 'deleteTool'
  },
  hide: {
    DELETE: 'hideTool'
  },
  enableSiteTools: {
    POST: 'enableSiteTools'
  }
}