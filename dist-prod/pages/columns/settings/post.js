!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";var e=NKC.methods.getDataById("data"),t=new Vue({el:"#app",data:{column:e.column,mainCategories:[],minorCategories:[],columnPosts:[],selectedMainCategoryId:"all",selectedMinorCategoryId:"all",threads:"",paging:"",editInfo:!1,error:"",selectedColumnPostsId:[],selectMul:!0},mounted:function(){this.init(),this.getCategories(),this.getPosts(0),moduleToColumn.init()},computed:{category:function(){return this.mainCategory},mainCategory:function(){for(var e,t=this.selectedMainCategoryId,o=0;o<this.mainCategories.length;o++){var n=this.mainCategories[o];if(n._id===t){e=n;break}}return e},minorCategory:function(){for(var e,t=this.selectedMinorCategoryId,o=0;o<this.minorCategories.length;o++){var n=this.minorCategories[o];if(n._id===t){e=n;break}}return e}},methods:{format:NKC.methods.format,moveSelected:function(){var e=this.selectedColumnPostsId;if(0===e.length)return screenTopWarning("请勾选需要处理的文章");this.move(e)},move:function(e,o,n){moduleToColumn.show((function(o){var n=o.minorCategoriesId,i=o.mainCategoriesId,s=o.operationType,r=o.categoryType;nkcAPI("/m/"+t.column._id+"/post","POST",{type:"moveById",postsId:e,operationType:s,categoryType:r,mainCategoriesId:i,minorCategoriesId:n}).then((function(){t.selectMainCategory(t.category),t.getCategories(),moduleToColumn.hide()})).catch((function(e){screenTopWarning(e)}))}),{selectMul:!0,showOperationType:!0,showCategoryType:!0,selectedMainCategoriesId:o,selectedMinorCategoriesId:n})},movePost:function(e,o){(-1===["sortByPostTimeDES","sortByPostTimeASC"].indexOf(e)||confirm("按发表时间排序后，原有排序将会丢失，确定要执行此操作？"))&&nkcAPI("/m/"+this.column._id+"/post","POST",{type:e,postsId:o,categoryId:"all"===t.category._id?"":t.category._id}).then((function(e){e.columnTopped&&(t.column.topped=e.columnTopped),e.categoryTopped&&(t.category.topped=e.categoryTopped),t.getPosts()})).catch((function(e){screenTopWarning(e)}))},getCategories:function(){var e=this.selectedMainCategoryId,o="/m/"+this.column._id+"/category?from=post";e&&"all"!==e&&(o+="&cid="+e),nkcAPI(o,"GET").then((function(e){t.mainCategories=e.mainCategories,t.minorCategories=e.minorCategories})).catch((function(e){screenTopWarning(e)}))},getPostById:function(e){for(var t=this.columnPosts,o=0;o<t.length;o++)if(e===t[o]._id)return t[o]},removePostById:function(e){for(var t=this.columnPosts,o=0;o<t.length;o++)if(e===t[o]._id){t.splice(o,1);break}},selectMulPosts:function(){this.selectMul=!this.selectMul,this.selectedColumnPostsId=[]},remove:function(e){confirm("确认要从专栏删除该文章？")&&nkcAPI("/m/"+this.column._id+"/post","POST",{type:"removeColumnPostById",postsId:e}).then((function(){t.getCategories();for(var o=0;o<e.length;o++)t.removePostById(e[o])})).catch((function(e){screenTopWarning(e)}))},removeSelected:function(){if(confirm("确认要从专栏删除已勾选的文章？")){var e=this.selectedColumnPostsId;nkcAPI("/m/"+this.column._id+"/post","POST",{type:"removeColumnPostById",postsId:e}).then((function(){t.getCategories();for(var o=0;o<e.length;o++)t.removePostById(e[o])})).catch((function(e){screenTopWarning(e)}))}},selectAll:function(){var e=this.columnPosts,t=this.selectedColumnPostsId;if(e.length!==t.length){for(var o=[],n=0;n<e.length;n++)o.push(e[n]._id);this.selectedColumnPostsId=o}else this.selectedColumnPostsId=[]},selectPage:function(e,t){"null"!==e&&this.getPosts(t)},getPosts:function(e){var o=this.selectedMainCategoryId,n=this.selectedMinorCategoryId;void 0===e&&(e=this.paging.page);var i="/m/"+this.column._id+"/post?page="+e;o&&"all"!==o&&(i+="&cid="+o),n&&"all"!==n&&(i+="&mcid="+n),nkcAPI(i,"GET").then((function(e){t.columnPosts=e.columnPosts,t.paging=e.paging})).catch((function(e){screenTopWarning(e)}))},init:function(){this.selectedColumnPostsId=[],this.paging={page:0,buttonValue:[]}},selectMainCategory:function(e,t){this.init(),this.selectedMainCategoryId=e._id,t||(this.getPosts(0),this.getCategories())},selectMinorCategory:function(e,t){this.init(),this.selectedMinorCategoryId=e._id,t||this.getPosts(0)}}})}));