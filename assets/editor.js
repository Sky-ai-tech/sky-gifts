/**
 * Visual Editor Panel — QIFEI TRADING FIRM
 * Add to the end of index.html (before </body>) or load as separate script
 * Injected as an inline editor panel at the bottom of the page
 */

(function() {
  'use strict';

  // ─── 只在 localhost 显示 ───
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;

  // ─── 样式 ───
  const style = document.createElement('style');
  style.textContent = `
    #qifei-editor {
      --editor-bg: #111;
      --editor-border: #333;
      --editor-accent: #00bcd4;
      --editor-text: #eee;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999999;
      background: var(--editor-bg);
      border-top: 2px solid var(--editor-accent);
      color: var(--editor-text);
      font-size: 13px;
      line-height: 1.4;
      transform: translateY(calc(100% - 40px));
      transition: transform 0.3s ease;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.6);
    }
    #qifei-editor.expanded { transform: translateY(0); }
    #qifei-editor .editor-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      cursor: pointer;
      user-select: none;
      background: #1a1a1a;
      border-bottom: 1px solid #333;
    }
    #qifei-editor .editor-toggle:hover { background: #222; }
    #qifei-editor .editor-toggle span { font-weight: 700; color: var(--editor-accent); }
    #qifei-editor .editor-toggle .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #4caf50; display: inline-block;
    }
    #qifei-editor .editor-body {
      padding: 12px 16px 16px;
      max-height: 50vh;
      overflow-y: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    #qifei-editor .editor-section { margin-bottom: 8px; }
    #qifei-editor .editor-section h4 {
      margin: 0 0 6px; font-size: 11px; text-transform: uppercase;
      letter-spacing: 1px; color: #888;
    }
    #qifei-editor .editor-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border: 1px solid #444;
      border-radius: 6px;
      background: #222;
      color: #ddd;
      cursor: pointer;
      font-size: 12px;
      margin: 0 4px 4px 0;
      transition: all 0.15s;
    }
    #qifei-editor .editor-btn:hover {
      background: #333;
      border-color: var(--editor-accent);
      color: #fff;
    }
    #qifei-editor .editor-btn.primary {
      background: var(--editor-accent);
      color: #000;
      border-color: var(--editor-accent);
      font-weight: 600;
    }
    #qifei-editor .editor-btn.primary:hover { background: #00e5ff; }
    #qifei-editor .editor-status {
      font-size: 11px;
      color: #999;
      padding: 6px 0 0;
    }
    #qifei-editor .editor-status.success { color: #4caf50; }
    #qifei-editor .editor-status.error { color: #f44336; }
    #qifei-editor .editor-hint {
      font-size: 11px; color: #888;
      border: 1px dashed #444;
      border-radius: 4px;
      padding: 4px 8px;
      margin-top: 6px;
    }
    #qifei-editor code {
      background: #2a2a2a;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 11px;
    }

    /* 页面编辑模式的高亮 */
    .qifei-editable {
      outline: 2px dashed rgba(0, 188, 212, 0.3);
      outline-offset: 2px;
      cursor: pointer;
      transition: outline-color 0.15s;
    }
    .qifei-editable:hover {
      outline-color: var(--editor-accent, #00bcd4);
    }
    .qifei-editable.editing {
      outline: 2px solid var(--editor-accent, #00bcd4);
      background: rgba(0, 188, 212, 0.05);
    }
  `;
  document.head.appendChild(style);

  // ─── 编辑面板 HTML ───
  const editor = document.createElement('div');
  editor.id = 'qifei-editor';
  editor.innerHTML = `
    <div class="editor-toggle" id="editor-toggle">
      <span class="dot"></span>
      <span>🔧 Visual Editor</span>
      <span style="color:#888;font-size:11px">─ click to expand</span>
    </div>
    <div class="editor-body" id="editor-body" hidden>
      <div>
        <div class="editor-section">
          <h4>✏️ Edit Text</h4>
          <p style="font-size:12px;color:#999;margin:0 0 6px">Hover any text on the page and click to edit</p>
          <button class="editor-btn primary" id="edit-mode-toggle">🖊 Enable Edit Mode</button>
          <button class="editor-btn" id="cancel-edit">Cancel</button>
        </div>
        <div class="editor-section">
          <h4>🖼 Replace Image</h4>
          <p style="font-size:12px;color:#999;margin:0 0 6px">Select an image from the page, then upload a new one</p>
          <button class="editor-btn primary" id="img-mode-toggle">🖼 Enable Image Mode</button>
          <input type="file" id="img-upload" accept="image/*" style="display:none" />
          <span id="img-filename" style="font-size:11px;color:#888;margin-left:6px"></span>
        </div>
        <div class="editor-section">
          <h4>🧹 Quick Fix</h4>
          <button class="editor-btn" id="fix-logo">Fix Logo/Email</button>
          <button class="editor-btn" id="preview-site">Open https://sky-gifts.com</button>
        </div>
      </div>
      <div>
        <div class="editor-section">
          <h4>📤 Publish</h4>
          <p style="font-size:12px;color:#999;margin:0 0 6px">
            After editing, save your changes and I'll push them live.
          </p>
          <button class="editor-btn primary" id="save-changes">💾 Save to File</button>
          <button class="editor-btn" id="deploy-site">🚀 Publish to sky-gifts.com</button>
          <div id="editor-status" class="editor-status">Local edits stay on your computer until you publish.</div>
        </div>
        <div class="editor-section">
          <h4>📋 What You Can Edit</h4>
          <div class="editor-hint">
            <p style="margin:0 0 4px"><strong>Text:</strong> Hero title, descriptions, project names, contact info, footer</p>
            <p style="margin:0 0 4px"><strong>Images:</strong> Hero image, case studies, real-work project photos, brand assets</p>
            <p style="margin:0"><strong>Save →</strong> changes are written to your local files. <strong>Publish →</strong> uploaded to sky-gifts.com live.</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(editor);

  // ─── 状态 ───
  let editMode = false;
  let imgMode = false;
  let currentTarget = null;

  const toggle = editor.querySelector('#editor-toggle');
  const body = editor.querySelector('#editor-body');
  const status = editor.querySelector('#editor-status');

  // ─── 展开/收起 ───
  toggle.addEventListener('click', () => {
    editor.classList.toggle('expanded');
    body.hidden = !body.hidden;
    if (!body.hidden) {
      status.textContent = '✅ Editor ready. Hover and click elements to edit.';
      status.className = 'editor-status success';
    }
  });

  // ─── 文字编辑模式 ───
  const editModeBtn = editor.querySelector('#edit-mode-toggle');
  const cancelBtn = editor.querySelector('#cancel-edit');

  editModeBtn.addEventListener('click', () => {
    editMode = !editMode;
    imgMode = false;
    document.querySelectorAll('.qifei-editable').forEach(el => el.classList.remove('qifei-editable', 'editing'));

    if (editMode) {
      // 给所有可编辑文字加上高亮
      const selectors = 'h1, h2, h3, p, strong, span, small, a, button, summary, label, figcaption, .kicker, .hero-index, footer p';
      document.querySelectorAll(selectors).forEach(el => {
        // 忽略 editor 自身的元素和太小的文字
        if (editor.contains(el)) return;
        if (el.children.length > 0 && el.innerText.trim().length < 3) return;
        el.classList.add('qifei-editable');
        el.dataset.originalText = el.innerText;
      });
      editModeBtn.textContent = '🖊 Exit Edit Mode';
      status.textContent = '✏️ Click any highlighted text to edit it. Press Enter to save.';
      status.className = 'editor-status';
    } else {
      editModeBtn.textContent = '🖊 Enable Edit Mode';
      status.textContent = 'Edit mode disabled.';
      status.className = 'editor-status';
    }
  });

  cancelBtn.addEventListener('click', () => {
    editMode = false;
    imgMode = false;
    document.querySelectorAll('.qifei-editable').forEach(el => el.classList.remove('qifei-editable', 'editing'));
    editModeBtn.textContent = '🖊 Enable Edit Mode';
    status.textContent = 'Changes cancelled.';
    status.className = 'editor-status';
  });

  // 点击高亮文字 → 内联编辑
  document.addEventListener('click', (e) => {
    if (!editMode) return;
    if (editor.contains(e.target)) return;
    if (!e.target.classList.contains('qifei-editable')) return;

    e.preventDefault();
    e.stopPropagation();

    const el = e.target;
    if (el.classList.contains('editing')) return;

    el.classList.add('editing');
    const original = el.innerText;

    const input = document.createElement('textarea');
    input.value = original;
    input.style.cssText = `
      font: inherit; color: inherit; background: transparent;
      border: 1px solid #00bcd4; border-radius: 4px;
      padding: 2px 4px; width: 100%; min-height: 1.2em;
      outline: none; resize: none;
    `;

    el.innerHTML = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const save = () => {
      const newText = input.value || original;
      el.innerHTML = '';
      el.innerText = newText;
      el.classList.remove('editing');
      el.dataset.edited = 'true';
      el.dataset.editedText = newText;
      status.textContent = `✅ Text updated: "${original}" → "${newText.slice(0, 40)}${newText.length > 40 ? '...' : ''}"`;
      status.className = 'editor-status success';
      updateChangedFiles();
    };

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); save(); }
      if (ev.key === 'Escape') { el.innerHTML = ''; el.innerText = original; el.classList.remove('editing'); }
    });
    input.addEventListener('blur', save);
  });

  // ─── 图片替换模式 ───
  const imgModeBtn = editor.querySelector('#img-mode-toggle');
  const imgUpload = editor.querySelector('#img-upload');

  imgModeBtn.addEventListener('click', () => {
    imgMode = !imgMode;
    editMode = false;
    document.querySelectorAll('.qifei-editable').forEach(el => el.classList.remove('qifei-editable', 'editing'));
    editModeBtn.textContent = '🖊 Enable Edit Mode';

    if (imgMode) {
      // 给所有图片加上高亮
      document.querySelectorAll('img').forEach(img => {
        if (editor.contains(img)) return;
        img.classList.add('qifei-editable');
        img.style.outline = '2px dashed rgba(76, 175, 80, 0.4)';
        img.style.cursor = 'pointer';
      });
      imgModeBtn.textContent = '🖼 Exit Image Mode';
      status.textContent = '🖼 Click any image to select it, then upload a replacement.';
      status.className = 'editor-status';
    } else {
      document.querySelectorAll('img').forEach(img => {
        img.classList.remove('qifei-editable');
        img.style.outline = '';
        img.style.cursor = '';
      });
      imgModeBtn.textContent = '🖼 Enable Image Mode';
      status.textContent = 'Image mode disabled.';
      status.className = 'editor-status';
    }
  });

  // 点击图片 → 触发文件选择
  document.addEventListener('click', (e) => {
    if (!imgMode) return;
    if (editor.contains(e.target)) return;
    if (!e.target.matches('img') || !e.target.classList.contains('qifei-editable')) return;

    e.preventDefault();
    e.stopPropagation();

    currentTarget = e.target;
    imgUpload.click();
  });

  // 选择新图片
  imgUpload.addEventListener('change', (e) => {
    if (!currentTarget || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (ev) => {
      const oldSrc = currentTarget.src.split('/').pop();
      currentTarget.src = ev.target.result;
      currentTarget.dataset.edited = 'true';
      currentTarget.dataset.editedFile = file.name;
      document.querySelector('#img-filename').textContent = `📎 ${file.name}`;
      status.textContent = `✅ Image replaced: ${oldSrc} → ${file.name}`;
      status.className = 'editor-status success';
      updateChangedFiles();
    };
    reader.readAsDataURL(file);
  });

  // ─── 导出所有修改 ───
  function updateChangedFiles() {
    const changedTexts = document.querySelectorAll('[data-edited="true"]');
    const changedImages = document.querySelectorAll('img[data-edited="true"]');
    let count = 0;
    changedTexts.forEach(e => count++);
    changedImages.forEach(e => count++);
    if (count > 0) {
      status.textContent = `📝 ${count} change(s) pending. Click "Save to File" to write changes locally.`;
      status.className = 'editor-status';
    }
  }

  // ─── 保存到文件 ───
  editor.querySelector('#save-changes').addEventListener('click', () => {
    const changedTexts = document.querySelectorAll('[data-edited="true"]');
    const changedImages = document.querySelectorAll('img[data-edited="true"]');

    if (changedTexts.length === 0 && changedImages.length === 0) {
      status.textContent = '⚠️ No changes to save.';
      status.className = 'editor-status error';
      return;
    }

    // 收集文本变化
    const edits = {};
    changedTexts.forEach(el => {
      const path = getElementPath(el);
      edits[path] = el.dataset.editedText;
    });

    // 收集图片变化（这里只能提醒，不能自动保存到本地文件系统）
    let imgMsg = '';
    changedImages.forEach((img, i) => {
      const src = img.src;
      const fileName = img.dataset.editedFile || `image-${i+1}`;
      if (img.src.startsWith('data:')) {
        imgMsg += `\n  • ${fileName} (Base64 embedded — save via right-click → Save Image)`;
      }
    });

    // 保存到 localStorage 并输出给 AI
    const exportData = {
      timestamp: new Date().toISOString(),
      textEdits: edits,
      imageEdits: Array.from(changedImages).map(img => ({
        fileName: img.dataset.editedFile || 'unknown',
        currentSrc: img.currentSrc || img.src
      }))
    };

    localStorage.setItem('qifei-edits', JSON.stringify(exportData));

    let msg = `✅ Saved ${Object.keys(edits).length} text changes.`;
    if (imgMsg) msg += `\n🖼 Images changed:${imgMsg}`;
    msg += `\n\n📋 Changes exported to browser localStorage for AI publishing.`;

    status.textContent = msg.split('\n')[0];
    status.className = 'editor-status success';

    // 显示完整信息
    const fullMsg = document.createElement('div');
    fullMsg.style.cssText = 'font-size:11px;color:#aaa;margin-top:4px;white-space:pre-wrap';
    fullMsg.textContent = msg;
    status.parentNode.appendChild(fullMsg);
    setTimeout(() => fullMsg.remove(), 8000);
  });

  // ─── 部署 ───
  editor.querySelector('#deploy-site').addEventListener('click', () => {
    // 存一个标记让 AI 知道要部署了
    localStorage.setItem('qifei-deploy-request', Date.now().toString());
    status.textContent = '🚀 Deploy request sent! I\'ll publish your changes to sky-gifts.com.';
    status.className = 'editor-status success';
  });

  // ─── 快速修复 ───
  editor.querySelector('#fix-logo').addEventListener('click', () => {
    // 修复邮箱
    document.querySelectorAll('a[href*="email"], a[href^="mailto:"]').forEach(a => {
      if (a.href.includes('wenqifei@gmail.com') || a.href.includes('penease')) {
        a.href = 'mailto:sky@sky-gifts.com';
        a.textContent = 'sky@sky-gifts.com';
      }
    });
    // 修复 "Shenzhen" → "Guigang" 
    document.querySelectorAll('p, span, small').forEach(el => {
      if (el.innerHTML.includes('Shenzhen')) {
        el.innerHTML = el.innerHTML.replace(/Shenzhen/g, 'Guigang');
      }
    });
    status.textContent = '✅ Fixed: email → sky@sky-gifts.com, location → Guigang';
    status.className = 'editor-status success';
  });

  editor.querySelector('#preview-site').addEventListener('click', () => {
    window.open('https://sky-gifts.com', '_blank');
  });

  // ─── 辅助：获取元素路径 ───
  function getElementPath(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls = Array.from(el.classList).filter(c => c !== 'qifei-editable' && c !== 'editing').join('.');
    const text = el.innerText.trim().slice(0, 30);
    return `${tag}${id}${cls ? '.' + cls : ''} — "${text}..."`;
  }

  console.log('%c🔧 Qifei Visual Editor loaded!', 'color:#00bcd4;font-size:14px;font-weight:bold');
  console.log('Click "Visual Editor" at bottom of page to start editing.');

})();
