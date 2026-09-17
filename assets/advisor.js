/* BoltProof Advisor — guided chat that recommends a package. Runs 100% in the browser. */
(function(){
  var WA = "https://wa.me/971585109454";
  var PK = {
    desk:{name:"AI Desk",hw:"Mac mini M5 Pro · 64 GB · 1 TB",price:"AED 16,500",staff:"1–10 staff",url:"/packages.html#desk",
      bullets:["Private chat + document Q&A for a small office","Models up to ~30B parameters (Qwen3 30B, Gemma 3 27B)","1–3 people at the same time","Runs headless; staff connect from their own laptops"]},
    work:{name:"AI Workhorse",hw:"Mac Studio M1 Ultra · 128 GB · 4 TB · certified pre-owned",price:"AED 20,000",staff:"5–25 staff",url:"/packages.html#workhorse",
      bullets:["70B-class models for legal, medical and multilingual work","Background automations (n8n agents) while staff chat","3–8 people at the same time","One unit available at this price"]},
    power:{name:"AI Powerhouse",hw:"Mac Studio M5 Ultra · 512 GB · 8 TB",price:"AED 59,000",staff:"25–100 staff",url:"/packages.html#powerhouse",
      bullets:["Largest open models (Llama 405B, Qwen3 235B full precision)","10+ concurrent users, several departments","Real-time transcription, code generation, shared inference server","Room to grow for years"]}
  };
  var Q = [
    {id:"industry",q:"What does your business do?",chips:["Law firm","Clinic / dental","Accounting","Real estate","Retail / e-commerce","Consulting / agency","Software / dev team","Other"]},
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

  function score(){
    var s=0, staff=A.staff, why=[];
    if(staff==="1–3"||staff==="4–10") s+=0; else if(staff==="11–25") s+=2; else if(staff==="26–50") s+=4; else s+=6;
    if(A.docs==="20,000–100,000") s+=1; if(A.docs==="More than 100,000") s+=3;
    if(A.use==="Transcription / translation") s+=1;
    if(A.use==="Code generation") s+=2;
    if(A.use==="Automations (email, invoices, CRM)") s+=1;
    if(A.industry==="Law firm"||A.industry==="Clinic / dental") s+=1;
    var key = s<=1?"desk":(s<=4?"work":"power");
    if(key==="desk") why.push("Under 10 staff and mostly chat or document Q&A: the AI Desk covers this comfortably.");
    if(key==="work") why.push((A.industry==="Law firm"||A.industry==="Clinic / dental")?"Legal and clinical wording is where 70B-class models earn their keep.":"Team size and workload sit in the Workhorse range.");
    if(key==="work"&&A.use==="Automations (email, invoices, CRM)") why.push("Automations run in the background while staff chat, which needs the extra memory.");
    if(key==="power") why.push("At this headcount or document volume you need 10+ concurrent users and the largest models.");
    return {key:key,why:why.join(" ")};
  }

  function recommend(){
    var r=score(), p=PK[r.key];
    var addons=[];
    if(A.backup!=="Yes") addons.push("Backup & Redundancy add-on (Synology 2-bay, from AED 4,500) — you said there is no tested backup today.");
    if(A.staff!=="1–3") addons.push("BoltProof Care (AED 1,000/month, no tie-in) — most teams above 5 staff take it.");
    if(A.data==="Mostly public content") addons.push("Note: if none of your work is confidential and you are under 5 people, a ChatGPT Team plan may be cheaper. We will say so on the call.");
    var summary = Object.keys(A).map(function(k){return k+": "+A[k];}).join("\n");
    var waText = encodeURIComponent("Hi BoltProof — the site advisor suggested the "+p.name+" ("+p.price+").\n\n"+summary+"\n\nCan you confirm and quote?");
    typing(function(){
      bot("Thanks. Based on your answers, here is what fits:");
      var c=el("div","a-card");
      c.innerHTML='<span class="pill">'+p.staff+'</span><h4>'+p.name+'</h4><div class="small">'+p.hw+'</div>'+
        '<div class="p">from '+p.price+'<small>excl. VAT · final quote confirmed on order</small></div>'+
        '<ul>'+p.bullets.map(function(b){return "<li>"+b+"</li>";}).join("")+'</ul>'+
        '<p class="why"><b>Why:</b> '+r.why+'</p>'+
        (addons.length?'<ul>'+addons.map(function(b){return "<li>"+b+"</li>";}).join("")+'</ul>':'')+
        '<div class="a-actions"><a class="btn-primary" target="_blank" rel="noopener" href="'+WA+'?text='+waText+'">Send this to BoltProof on WhatsApp</a>'+
        '<a class="btn-secondary" href="'+p.url+'">See the '+p.name+' in detail</a>'+
        '<button class="btn-secondary" id="a-email">Email me this recommendation</button></div>';
      body.appendChild(c);scroll();
      document.getElementById("a-email").onclick=function(){emailForm(p,summary);};
    },900);
  }

  function emailForm(p,summary){
    var f=el("form","a-card");
    f.action="https://formsubmit.co/elias@boltproof.com";f.method="POST";
    f.innerHTML='<h4 style="font-size:16px">Where should we send it?</h4>'+
      '<input type="hidden" name="_subject" value="Advisor lead: '+p.name+'">'+
      '<input type="hidden" name="_template" value="table">'+
      '<input type="hidden" name="_next" value="https://boltproof.com/thank-you.html">'+
      '<input type="hidden" name="recommendation" value="'+p.name+' — '+p.price+'">'+
      '<textarea name="answers" hidden>'+summary+'</textarea>'+
      '<input name="name" placeholder="Your name" required style="width:100%;font:inherit;padding:10px 12px;border:1px solid #d2d2d7;border-radius:12px;margin:8px 0">'+
      '<input name="email" type="email" placeholder="Work email" required style="width:100%;font:inherit;padding:10px 12px;border:1px solid #d2d2d7;border-radius:12px;margin:0 0 8px">'+
      '<input name="company" placeholder="Company (optional)" style="width:100%;font:inherit;padding:10px 12px;border:1px solid #d2d2d7;border-radius:12px;margin:0 0 10px">'+
      '<div class="a-actions"><button class="btn-primary" type="submit">Send recommendation</button></div>'+
      '<p class="small" style="margin:8px 0 0;font-size:12px">A written recommendation and quote within one business day. No obligation.</p>';
    body.appendChild(f);scroll();
  }

  function build(container,isInline){
    inline=isInline; host=container;
    host.innerHTML='<div class="advisor-head"><div>BoltProof advisor<small>8 quick questions · no data leaves this page until you send it</small></div>'+(isInline?'':'<button class="advisor-close" aria-label="Close">×</button>')+'</div><div class="advisor-body"></div><div class="a-foot">Not a chatbot that guesses. A fixed set of questions, an honest answer.</div>';
    body=host.querySelector(".advisor-body");
    if(!isInline) host.querySelector(".advisor-close").onclick=function(){host.classList.remove("open");};
    A={};step=0;
    typing(function(){bot("Hello. I will ask 8 short questions and suggest the right BoltProof package, or tell you if cloud AI is the better buy.");ask();},400);
  }

  window.BoltProofAdvisor={
    open:function(){var h=document.getElementById("advisor");if(!h)return;if(!h.dataset.built){build(h,false);h.dataset.built=1;}h.classList.add("open");},
    inline:function(id){var h=document.getElementById(id);if(h){h.classList.add("advisor","inline");build(h,true);}}
  };
  document.addEventListener("DOMContentLoaded",function(){
    var l=document.querySelector(".advisor-launch");if(l)l.onclick=window.BoltProofAdvisor.open;
    var i=document.querySelector("[data-advisor-inline]");if(i)window.BoltProofAdvisor.inline(i.id);
    var t=document.querySelector(".nav-toggle");if(t)t.onclick=function(){document.querySelector(".nav-links").classList.toggle("open");};
  });
})();
