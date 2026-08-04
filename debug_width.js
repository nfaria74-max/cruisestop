const data = JSON.stringify({
  innerWidth: window.innerWidth,
  bodyClient: document.body.clientWidth,
  bodyScroll: document.body.scrollWidth,
  docScroll: document.documentElement.scrollWidth,
  col: (() => { const e=document.querySelector('.route-column'); const r=e.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width,scroll:e.scrollWidth,client:e.clientWidth}; })(),
  panel: (() => { const e=document.querySelector('.route-summary-panel'); const r=e.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width,scroll:e.scrollWidth,client:e.clientWidth}; })(),
  nav: (() => { const e=document.querySelector('.bottom-app-nav'); const r=e.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width,scroll:e.scrollWidth,client:e.clientWidth}; })()
});
document.body.innerHTML = '<pre style="white-space:pre-wrap;font:16px monospace;color:#000;background:#fff">'+data+'</pre>';
