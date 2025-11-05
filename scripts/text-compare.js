document.addEventListener("DOMContentLoaded", function () {
  const textA = document.getElementById('textA');
  const textB = document.getElementById('textB');
  const compareBtn = document.getElementById('compareBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultA = document.getElementById('compareResultA');
  const resultB = document.getElementById('compareResultB');
  const linesA = document.getElementById('linesA');
  const linesB = document.getElementById('linesB');

function updateLineNumbers(textarea, linesDiv) {
  const lines = textarea.value.split('\n').length || 1;
  linesDiv.innerHTML = Array.from({length: lines}, (_, i) => (i+1)).join('\n');
  // Sync scroll
  linesDiv.scrollTop = textarea.scrollTop;
}

textA.addEventListener('scroll', () => linesA.scrollTop = textA.scrollTop);
textB.addEventListener('scroll', () => linesB.scrollTop = textB.scrollTop);

  textA.addEventListener('input', () => updateLineNumbers(textA, linesA));
  textB.addEventListener('input', () => updateLineNumbers(textB, linesB));
  // Initialize line numbers
  updateLineNumbers(textA, linesA);
  updateLineNumbers(textB, linesB);

  function diffLines(a, b) {
    const aLines = a.split('\n');
    const bLines = b.split('\n');
    const maxLen = Math.max(aLines.length, bLines.length);
    let outA = '', outB = '';
    for (let i = 0; i < maxLen; i++) {
      const lineA = aLines[i] || '';
      const lineB = bLines[i] || '';
      if (lineA === lineB) {
        outA += lineA + '\n';
        outB += lineB + '\n';
      } else {
        outA += `<span style="background:#ff4d6d33;color:#ff4d6d;">${lineA || '[empty]'}</span>\n`;
        outB += `<span style="background:#00ff8733;color:#007f5f;">${lineB || '[empty]'}</span>\n`;
      }
    }
    return [outA.trimEnd(), outB.trimEnd()];
  }

  compareBtn.addEventListener('click', function () {
    const a = textA.value;
    const b = textB.value;
    const [outA, outB] = diffLines(a, b);
    resultA.innerHTML = outA || '<span style="color:var(--accent,#00ffe7);font-weight:600;">No input.</span>';
    resultB.innerHTML = outB || '<span style="color:var(--accent,#00ffe7);font-weight:600;">No input.</span>';
  });

  clearBtn.addEventListener('click', function () {
    textA.value = '';
    textB.value = '';
    resultA.innerHTML = '';
    resultB.innerHTML = '';
    updateLineNumbers(textA, linesA);
    updateLineNumbers(textB, linesB);
  });
});