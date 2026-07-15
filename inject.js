(function(){
    if(document.getElementById('md5-inject-tool')) return;
    var css = 'position:fixed!important;bottom:20px!important;right:20px!important;z-index:999999999!important;background:#0d0d0d!important;border:2px solid #00ff41!important;border-radius:12px!important;padding:15px 20px!important;color:#00ff41!important;font-family:Courier New,monospace!important;box-shadow:0 0 30px rgba(0,255,65,0.4)!important;width:320px!important;max-width:90%!important;';
    var div = document.createElement('div'); div.id = 'md5-inject-tool'; div.style.cssText = css;
    div.innerHTML = '<div style="display:flex;justify-content:space-between;border-bottom:1px solid #00ff41;padding-bottom:8px;margin-bottom:12px;font-weight:bold;font-size:14px;cursor:move;" id="md5-drag-header"><span style="text-shadow:0 0 10px #00ff41;">[ MD5 ANALYZER ]</span><span style="color:#007f1f;cursor:pointer;" onclick="this.parentElement.parentElement.style.display=\'none\'">[ X ]</span></div><div style="display:flex;gap:8px;margin-bottom:10px;"><input type="text" id="inject-md5-input" placeholder="Nhập MD5 (32 ký tự)" style="flex:1;background:#000;border:1px solid #00ff41;color:#00ff41;border-radius:4px;padding:8px;font-size:13px;outline:none;width:100%;"><button onclick="runInjectMD5()" style="background:#00ff41;color:#000;border:none;border-radius:4px;padding:8px 12px;font-weight:bold;font-size:13px;cursor:pointer;">Dự đoán</button></div><div id="inject-result-area" style="background:#000;border:1px solid #00ff41;border-radius:4px;padding:10px;font-size:12px;display:none;"><div id="inject-loading" style="color:#00cc33;text-align:center;">Đang phân tích...</div><div id="inject-result-content" style="display:none;"><div style="display:flex;justify-content:space-around;text-align:center;margin-bottom:5px;"><div><div style="color:#007f1f;">TÀI</div><div id="inj-tai" style="color:#2ecc71;font-size:20px;font-weight:bold;">0%</div></div><div><div style="color:#007f1f;">XỈU</div><div id="inj-xiu" style="color:#e74c3c;font-size:20px;font-weight:bold;">0%</div></div></div><div style="display:flex;justify-content:space-between;border-top:1px dashed #333;padding-top:5px;color:#007f1f;"><span>KQ: <b id="inj-result" style="color:#00ff41;">-</b></span><span>Entropy: <b id="inj-entropy" style="color:#00ff41;">-</b></span></div></div></div>';
    document.body.appendChild(div);
    var dragHeader = document.getElementById('md5-drag-header');
    var toolDiv = document.getElementById('md5-inject-tool');
    var isDragging = false, offsetX, offsetY;
    dragHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        var rect = toolDiv.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        toolDiv.style.position = 'fixed';
        toolDiv.style.bottom = 'auto';
        toolDiv.style.right = 'auto';
    });
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            toolDiv.style.left = (e.clientX - offsetX) + 'px';
            toolDiv.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', function() { isDragging = false; });
    window.runInjectMD5 = function() {
        var input = document.getElementById('inject-md5-input').value.trim();
        var resArea = document.getElementById('inject-result-area');
        var loading = document.getElementById('inject-loading');
        var content = document.getElementById('inject-result-content');
        if(!input) { alert("Vui lòng nhập MD5!"); return; }
        resArea.style.display = 'block';
        content.style.display = 'none';
        loading.style.display = 'block';
        loading.innerText = "Đang phân tích...";
        setTimeout(function() {
            var h = input.toLowerCase();
            var sum = h.split('').reduce((a,c)=>a+parseInt(c,16),0);
            var entropy = -Object.values(h.split('').reduce((a,c)=>(a[c]=(a[c]||0)+1,a),{})).map(v=>v/h.length).reduce((s,p)=>s+(p*Math.log2(p)||0),0);
            var score = (sum % 100 + (parseInt(h,16)%100) + entropy * 10) % 100;
            var tai = parseFloat(score.toFixed(2));
            var xiu = parseFloat((100 - score).toFixed(2));
            loading.style.display = 'none'; content.style.display = 'block';
            document.getElementById('inj-tai').innerText = tai + '%';
            document.getElementById('inj-xiu').innerText = xiu + '%';
            document.getElementById('inj-result').innerText = tai >= 50 ? 'TÀI' : 'XỈU';
            document.getElementById('inj-result').style.color = tai >= 50 ? '#2ecc71' : '#e74c3c';
            document.getElementById('inj-entropy').innerText = entropy.toFixed(4);
        }, 1500);
    };
})();
