(function(){
  try{
    var saved = localStorage.getItem('bp-theme');
    if(saved === 'light'){ document.documentElement.setAttribute('data-theme','light'); }
  }catch(e){}
})();
