/* BoltProof Advisor — guided discovery chat that ends in a private-AI assessment. Runs 100% in the browser. No hardware, no prices. */
(function(){
  var WA = "https://wa.me/971585109454";
  var Q = [
    {id:"industry",q:"What does your business do?",chips:["Clinic / dental","Accounting","Real estate","Retail / e-commerce","Consulting / agency","Software / dev team","Other"]},
    {id:"staff",q:"How many people would use it?",chips:["1–3","4–10","11–25","26–50","50+"]},
    {id:"data",q:"How sensitive is the data it will see?",chips:["Client files / patient records","Internal documents only","Mostly public content"]},
    {id:"docs",q:"Roughly how many documents should it know about?",chips:["Under 1,000","1,000–20,000","20,000–100,000","More than 100,000"]},
    {id:"use",q:"What is the main job? Pick the biggest one.",chips:["Chat + drafting","Questions over our documents","Automations (email, invoices, CRM)","Transcription / translation","Code generation"]},
    {id:"remote",q:"Do staff work from home or other branches?",chips:["Yes","No"]},
    {id:"backup",q:"Do you have a tested backup today?",chips:["Yes","No","Not sure"]},
    {id:"timeline",q:"When do you want it running?",chips:["This month","1–3 months","Just researching"]}
  ];
  var A = {}, body, host, inline=false, step=0;

  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
  function scroll(){body.scrollTop=body.scrollHeight;}
  function typing(cb,ms){var t=el("div","a-typing","<i></i><i></i><i></i>");body.appendChild(t);scroll();setTimeout(function(){t.remove();cb();},ms||650);}
  function bot(h){body.appendChild(el("div","a-msg",h));scroll();}
  function me(h){body.appendChild(el("div","a-msg me",h));scroll();}
  function chips(list,on){var w=el("div","a-chips");list.forEach(function(c){var b=el("button","a-chip",c);b.onclick=function(){w.remove();on(c);};w.appendChild(b);});body.appendChild(w);scroll();}

  function ask(){
    if(step>=Q.length) return recommend();
    var q=Q[step];
    typing(function(){bot(q.q);chips(q.chips,function(ans){A[q.id]=ans;me(ans);step++;ask();});},step===0?300:600);
  }

  function recommend(){
    var summary = Object.keys(A).map(function(k){return k+": "+A[k];}).join("\n");
    var honest = (A.data==="Mostly public content") ? '<p class="why"><b>Honest note:</b> if none of your work is confidential and you\'re a small team, a ChatGPT Team plan may be cheaper. We\'ll tell you so on the call — no hard sell.</p>' : '';
    var waText = encodeURIComponent("Hi BoltProof — I'd like a private AI assessment. Here's a bit about us:\n\n"+summary);
    typing(function(){
      bot("Thanks — that's everything I need. Here's what happens next:");
      var c=el("div","a-card");
      c.innerHTML='<h4>We review and reply within one business day</h4>'+
        '<p class="small">One of us reads your answers and comes back with a short written recommendation: whether private AI is the right call for you, roughly what it would involve, and a fixed-fee proposal. No obligation.</p>'+
        honest+
        '<div class="a-actions"><a class="btn-primary" target="_blank" rel="noopener" href="'+WA+'?text='+waText+'">Send this to BoltProof on WhatsApp</a>'+
        '<a class="btn-secondary" href="/configurator.html">Book an assessment</a>'+
        '<button class="btn-secondary" id="a-email">Email me my answers</button></div>';
      body.appendChild(c);scroll();
      document.getElementById("a-email").onclick=function(){emailForm(summary);};
    },900);
  }

  function emailForm(summary){
    var f=el("form","a-card");
    f.action="https://formsubmit.co/elias@boltproof.com";f.method="POST";
    f.innerHTML='<h4 style="font-size:16px">Where should we send it?</h4>'+
      '<input type="hidden" name="_subject" value="Private AI assessment request">'+
      '<input type="hidden" name="_template" value="table">'+
      '<input type="hidden" name="_next" value="https://boltproof.com/thank-you.html">'+
      '<textarea name="answers" hidden>'+summary+'</textarea>'+
      '<input name="name" placeholder="Your name" required style="width:100%;font:inherit;padding:10px 12px;border:1px solid #d2d2d7;border-radius:12px;margin:8px 0">'+
      '<input name="email" type="email" placeholder="Work email" required style="width:100%;font:inherit;padding:10px 12px;border:1px solid #d2d2d7;border-radius:12px;margin:0 0 8px">'+
      '<input name="company" placeholder="Company (optional)" style="width:100%;font:inherit;padding:10px 12px;border:1px solid #d2d2d7;border-radius:12px;margin:0 0 10px">'+
      '<div class="a-actions"><button class="btn-primary" type="submit">Send my answers</button></div>'+
      '<p class="small" style="margin:8px 0 0;font-size:12px">A written recommendation and fixed-fee proposal within one business day. No obligation.</p>';
    body.appendChild(f);scroll();
  }

  function build(container,isInline){
    inline=isInline; host=container;
    host.innerHTML='<div class="advisor-head"><div>BoltProof advisor<small>8 quick questions · no data leaves this page until you send it</small></div>'+(isInline?'':'<button class="advisor-close" aria-label="Close">×</button>')+'</div><div class="advisor-body"></div><div class="a-foot">Not a chatbot that guesses. A fixed set of questions, an honest answer.</div>';
    body=host.querySelector(".advisor-body");
    if(!isInline) host.querySelector(".advisor-close").onclick=function(){host.classList.remove("open");};
    A={};step=0;
    typing(function(){bot("Hello. I'll ask 8 short questions and help figure out whether private AI makes sense for your business — and if cloud AI is actually the better buy, I'll say so.");ask();},400);
  }

  window.BoltProofAdvisor={
    open:function(){var h=document.getElementById("advisor");if(!h)return;if(!h.dataset.built){build(h,false);h.dataset.built=1;}h.classList.add("open");},
    inline:function(id){var h=document.getElementById(id);if(h){h.classList.add("advisor","inline");build(h,true);}}
  };
  document.addEventListener("DOMContentLoaded",function(){
    var l=document.querySelector(".advisor-launch");if(l)l.onclick=window.BoltProofAdvisor.open;
    var i=document.querySelector("[data-advisor-inline]");if(i)window.BoltProofAdvisor.inline(i.id);
    var t=document.querySelector(".nav-toggle");if(t)t.onclick=function(){document.querySelector(".nav-links").classList.toggle("open");};
    var tt=document.querySelector(".theme-toggle");
    if(tt) tt.onclick=function(){
      var isLight = document.documentElement.getAttribute("data-theme")==="light";
      if(isLight){ document.documentElement.removeAttribute("data-theme"); try{localStorage.setItem("bp-theme","dark");}catch(e){} }
      else{ document.documentElement.setAttribute("data-theme","light"); try{localStorage.setItem("bp-theme","light");}catch(e){} }
    };
  });
})();
