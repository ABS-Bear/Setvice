(()=>{
  const config=window.ABServiceConfig||{};
  const hasOwn=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
  const leadApiUrl=hasOwn(config,'leadApiUrl')?config.leadApiUrl:'https://abservice-leads-v2.vercel.app/api/lead';

  function ensureProductNavStyles(){
    if(document.getElementById('abservice-product-nav')) return;
    const style=document.createElement('style');
    style.id='abservice-product-nav';
    style.textContent=`
      .header-nav-enabled .nav{margin-left:auto;display:flex;align-items:center;gap:8px}
      .header-nav-enabled .nav a{transition:background .18s ease,border-color .18s ease,color .18s ease,transform .18s ease}
      .header-nav-enabled .nav .nav-product{min-height:42px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(11,23,19,.18);border-radius:12px;background:rgba(255,255,255,.54);color:var(--ink);font-size:14px;font-weight:900;letter-spacing:-.015em;white-space:nowrap}
      .header-nav-enabled .nav .nav-product:hover{transform:translateY(-1px);border-color:rgba(11,23,19,.36)}
      .header-nav-enabled .nav .nav-product.is-active{background:var(--accent);border-color:var(--accent);color:var(--ink);box-shadow:0 6px 18px rgba(11,23,19,.08)}
      .header-nav-enabled .nav .nav-secondary{padding:9px 4px;color:#7a847f;font-size:11.5px;font-weight:700;white-space:nowrap}
      .header-nav-enabled .nav .nav-product + .nav-secondary{margin-left:10px}
      .header-nav-enabled .nav .nav-secondary:hover{color:var(--ink)}
      @media(max-width:1150px){.header-nav-enabled .nav .nav-secondary{display:none}}
      @media(max-width:1020px){.header-nav-enabled .nav{display:flex}}
      @media(max-width:700px){
        .header-nav-enabled{min-height:auto;flex-wrap:wrap;gap:8px 12px;padding:8px 0}
        .header-nav-enabled .brand{flex:1 1 auto}
        .header-nav-enabled .nav-actions{margin-left:auto}
        .header-nav-enabled .nav{order:3;width:100%;margin:0;display:flex;gap:8px}
        .header-nav-enabled .nav .nav-product{flex:1;min-height:42px;padding:0 12px;font-size:13px}
        .header-nav-enabled .nav .nav-secondary{display:none}
      }
    `;
    document.head.appendChild(style);
  }

  const blobToBase64=blob=>new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');
    reader.onerror=reject;
    reader.readAsDataURL(blob);
  });

  async function compressImage(file){
    const url=URL.createObjectURL(file);
    try{
      const img=new Image();
      img.src=url;
      await img.decode();
      const maxSide=1600;
      const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
      canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      const toBlob=quality=>new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
      let blob=await toBlob(.78);
      if(blob&&blob.size>1_400_000) blob=await toBlob(.62);
      return blob||file;
    }finally{
      URL.revokeObjectURL(url);
    }
  }

  async function collectAttachments(form){
    const selected=[...form.querySelectorAll('input[type="file"]')].flatMap(input=>[...(input.files||[])]).slice(0,2);
    const attachments=[];
    let skipped=0;
    for(const file of selected){
      let blob=file;
      let name=file.name;
      let type=file.type||'application/octet-stream';
      if(type.startsWith('image/')){
        blob=await compressImage(file);
        name=file.name.replace(/\.[^.]+$/,'')+'.jpg';
        type='image/jpeg';
      }
      if(blob.size>1_500_000){
        skipped++;
        continue;
      }
      attachments.push({name,type,data:await blobToBase64(blob)});
    }
    return {attachments,skipped};
  }

  async function postLead(payload){
    const response=await fetch(leadApiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(result.error||`HTTP ${response.status}`);
    return result;
  }

  window.ABService={
    config,
    leadApiUrl,
    collectAttachments,
    ensureProductNavStyles,
    postLead
  };
})();
