     'use strict';
// 郵便番号→住所自動入力
const fetchAddress = zipCode => {
    if (zipCode.length === 7) {
        fetch(`https://api.zipaddress.net/?zipcode=${zipCode}`, { mode: 'cors' })
            .then(res => res.json())
            .then(data => {
                document.getElementById('address').value = data.code === 200 ? data.data.fullAddress : '住所が見つかりません';
            });
    }
};
document.getElementById('zipcode').addEventListener('input', e => fetchAddress(e.target.value));

// 生年月日→年齢自動計算
const updateAgeAtCamp = () => {
    const birthdayInput = document.getElementById('birthday');
    const ageAtCampSpan = document.getElementById('ageAtCamp');
    if (!birthdayInput || !ageAtCampSpan) return;
    const birth = birthdayInput.value;
    if (!birth) {
        ageAtCampSpan.textContent = '';
        return;
    }
    const campStart = new Date('2026-05-04');
    const birthDate = new Date(birth);
    let age = campStart.getFullYear() - birthDate.getFullYear();
    const m = campStart.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && campStart.getDate() < birthDate.getDate())) {
        age--;
    }
    ageAtCampSpan.textContent = `（キャンプ開始時: ${age}歳）`;
    const ageInput = document.getElementById('age');
    if (ageInput) ageInput.value = age;
};
document.getElementById('birthday').addEventListener('change', updateAgeAtCamp);
window.addEventListener('DOMContentLoaded', updateAgeAtCamp);

// 追加申込者欄の生年月日→年齢自動計算
function updateExtraAges() {
    for (let i = 4; i <= 14; i++) {
        const b = document.getElementById('birthday' + i);
        const a = document.getElementById('age' + i);
        if (b && a) {
            b.addEventListener('change', function () {
                const birth = b.value;
                if (!birth) { a.value = ''; return; }
                const campStart = new Date('2026-05-04');
                const birthDate = new Date(birth);
                let age = campStart.getFullYear() - birthDate.getFullYear();
                const m = campStart.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && campStart.getDate() < birthDate.getDate())) {
                    age--;
                }
                a.value = age;
            });
        }
    }
}

// render applicant blocks dynamically (4..10)
function renderExtraApplicants(start = 4, end = 14) {
    const container = document.getElementById('extraApplicants');
    if (!container) return;
    let html = '';
    for (let i = start; i <= end; i++) {
        html += `
            <div id="partialFields${i}" class="partialFields" style="display:none; margin:1em 0;">
                <label for="first-name${i}">申込個人名<span class="required">*</span></label>
                <input type="text" id="first-name${i}" name="first-name${i}" maxlength="50" placeholder="太郎" required>
                <label for="first-kana${i}">申込個人名（ふりがな）<span class="required">*</span></label>
                <input type="text" id="first-kana${i}" name="first-kana${i}" maxlength="50" placeholder="たろう" required>
                <label>性別<span class="required">*</span></label>
                <label><input type="radio" name="gender${i}" value="male" required> 男性</label>
                <label><input type="radio" name="gender${i}" value="female"> 女性</label>
                <label for="birthday${i}">生年月日<span class="required">*</span></label>
                <input type="date" name="birthday${i}" id="birthday${i}" value="2000-01-01" required>
                <label for="age${i}">年齢<span class="required">*</span></label>
                <input type="number" name="age${i}" id="age${i}" value="30" max="120" required>
                <div style="margin-top:1em;">
                    <table style="width:auto; margin:0.5em 0; border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th></th>
                                <th>〇申し込む</th>
                                <th>×申し込まない</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>朝食</td>
                                <td><input type="radio" name="breakfast${i}" value="yes" checked></td>
                                <td><input type="radio" name="breakfast${i}" value="no"></td>
                            </tr>
                            <tr>
                                <td>昼食</td>
                                <td><input type="radio" name="lunch${i}" value="yes" checked></td>
                                <td><input type="radio" name="lunch${i}" value="no"></td>
                            </tr>
                            <tr>
                                <td>夕食</td>
                                <td><input type="radio" name="dinner${i}" value="yes" checked></td>
                                <td><input type="radio" name="dinner${i}" value="no"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// 参加日が変わったら帰宅日のminを更新
document.getElementById('startDate').addEventListener('change', e => {
    const start = e.target.value;
    const endInput = document.getElementById('endDate');
    endInput.min = start;
    if (endInput.value < start) endInput.value = start;
});

// 参加状況切替
const toggleFields = () => {
    const selectValue = document.getElementById('GOBACK').value;
    const partialFields = document.getElementById('partialFields');
    const partialFields2 = document.getElementById('partialFields2');
    if (selectValue === 'MiddleCameBack') {
        partialFields.style.display = 'block';
        partialFields2.style.display = 'none';
    } else if (selectValue === 'All') {
        partialFields2.style.display = 'block';
        partialFields.style.display = 'none';
    } else {
        partialFields.style.display = 'none';
        partialFields2.style.display = 'none';
    }
};
document.getElementById('GOBACK').addEventListener('change', toggleFields);

// ラジオボタンで下のフォーム表示/非表示切り替え
function updateEntryType() {
    const type = document.querySelector('input[name="entryType"]:checked').value;
    const goback = document.getElementById('GOBACK');
    const gobackLabel = document.querySelector('label[for="GOBACK"]');
    const partialFields = document.getElementById('partialFields');
    const partialFields2 = document.getElementById('partialFields2');
    if (type === 'cancel') {
        goback.style.display = 'none';
        if (gobackLabel) gobackLabel.style.display = 'none';
        partialFields.style.display = 'none';
        partialFields2.style.display = 'none';
        document.getElementById('partialFields3').style.display = 'none';
        document.getElementById('partialFields4').style.display = 'none';
    } else {
        goback.style.display = '';
        if (gobackLabel) gobackLabel.style.display = '';
        // 新規申し込み時のみ申込者追加ボタン表示
        if (type === 'new') {
            document.getElementById('partialFields3').style.display = 'block';
        } else {
            document.getElementById('partialFields3').style.display = 'none';
            document.getElementById('partialFields4').style.display = 'none';
        }
        // 状態に応じて部分/全参加のフォームを再表示
        if (goback.value === 'MiddleCameBack') {
            partialFields.style.display = 'block';
            partialFields2.style.display = 'none';
        } else if (goback.value === 'All') {
            partialFields2.style.display = 'block';
            partialFields.style.display = 'none';
        } else {
            partialFields.style.display = 'none';
            partialFields2.style.display = 'none';
        }
    }
}
document.getElementById('entryTypeGroup').addEventListener('change', updateEntryType);
// 初期化
window.addEventListener('DOMContentLoaded', updateEntryType);
// 部分参加 食事・宿泊ラジオボタン生成
const generateMealTable = () => {
    const start = document.getElementById('startDate')?.value || '2026-05-04';
    const end = document.getElementById('endDate')?.value || '2026-05-06';
    const firstMeal = document.getElementById('first-meal')?.value || 'lunch';
    const lastMeal = document.getElementById('last-meal')?.value || 'lunch';
    const days = [];
    let d = new Date(start);
    const endD = new Date(end);
    while (d <= endD) {
        days.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }
    const mealDefs = [
        { key: 'breakfast', label: '朝食' },
        { key: 'lunch', label: '昼食' },
        { key: 'dinner', label: '夕食' },
        { key: 'stay', label: '宿泊' },
    ];
    let html = '<table><thead><tr><th></th><th>〇申し込む</th><th>×申し込まない</th></tr></thead><tbody>';
    days.forEach((date, i) => {
        const mmdd = `${date.getMonth() + 1}/${date.getDate()}`;
        mealDefs.forEach(meal => {
            // 最終日のlastMealが"brackfeast"（朝食前）の場合、その日の昼食・夕食・宿泊は表示しない
            if (i === days.length - 1 && lastMeal === 'brackfeast') {
                if (meal.key === 'breakfast') {
                    // 朝食は表示
                } else {
                    return;
                }
            }
            if (meal.key === 'stay' && i === days.length - 1) return;
            if (i === 0) {
                if (meal.key === 'breakfast' && firstMeal !== 'brackfeast') return;
                if (meal.key === 'lunch' && (firstMeal === 'dinner' || firstMeal === 'afterdinner')) return;
                if (meal.key === 'dinner' && firstMeal === 'afterdinner') return;
            }
            if (i === days.length - 1) {
                if (meal.key === 'dinner' && (lastMeal === 'lunch' || lastMeal === 'breakfast' || lastMeal === 'beforbrackfeast')) return;
                if (meal.key === 'lunch' && (lastMeal === 'breakfast' || lastMeal === 'beforbrackfeast')) return;
                if (meal.key === 'breakfast' && lastMeal === 'beforbrackfeast') return;
            }
            const labelCell = meal.key === 'stay'
                ? `<b>${mmdd}宿泊</b>`
                : `${mmdd}${meal.label}`;
            html += `<tr><td>${labelCell}</td>` +
                `<td><input type="radio" name="${meal.key}[${i + 1}]" value="yes" class="large-object" checked></td>` +
                `<td><input type="radio" name="${meal.key}[${i + 1}]" value="no" class="large-object"></td></tr>`;
        });
    });
    html += '</tbody></table>';
    document.getElementById('dynamicMealTable').innerHTML = html;
};
// 全参加 食事・宿泊ラジオボタン生成
const generateAllJoinMealTable = () => {
    const days = [
        { date: '5/4', meals: ['昼食', '夕食', '宿泊'] },
        { date: '5/5', meals: ['朝食', '昼食', '夕食', '宿泊'] },
        { date: '5/6', meals: ['朝食', '昼食'] },
    ];
    let html = '<table><thead><tr><th></th><th>〇申し込む</th><th>×申し込まない</th></tr></thead><tbody>';
    days.forEach((d, i) => {
        d.meals.forEach(meal => {
            const labelCell = meal === '宿泊'
                ? `<b>${d.date}${meal}</b>`
                : `${d.date}${meal}`;
            html += `<tr><td>${labelCell}</td>` +
                `<td><input type="radio" name="${meal}[${i + 1}]" value="yes" class="large-object" checked></td>` +
                `<td><input type="radio" name="${meal}[${i + 1}]" value="no" class="large-object"></td></tr>`;
        });
    });
    html += '</tbody></table>';
    document.getElementById('allJoinMealTable').innerHTML = html;
};
// 到着・帰宅時間の選択肢を日付ごとに動的生成
function updateMealSelect(dateId, selectId) {
    const mealOptionsByDate = {
        '2026-05-04': [
            { value: 'lunch', label: '昼食前' },
            { value: 'dinner', label: '夕食前' },
            { value: 'afterdinner', label: '夕食後' }
        ],
        '2026-05-05': [
            { value: 'brackfeast', label: '朝食前' },
            { value: 'lunch', label: '昼食前' },
            { value: 'dinner', label: '夕食前' },
            { value: 'afterdinner', label: '夕食後' }
        ],
        '2026-05-06': [
            { value: 'brackfeast', label: '昼食前' },
            { value: 'lunch', label: '夕食前' }
        ]
    };
    const date = document.getElementById(dateId)?.value;
    const select = document.getElementById(selectId);
    if (!date || !select) return;
    const opts = mealOptionsByDate[date] || [];
    select.innerHTML = '';
    opts.forEach((opt, idx) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (idx === 0) option.selected = true;
        select.appendChild(option);
    });
}
// イベント登録
window.addEventListener('DOMContentLoaded', () => {
    // generate extra applicant blocks and wire up their age listeners
    renderExtraApplicants(4, 10);
    updateExtraAges();
    updateMealSelect('startDate', 'first-meal');
    updateMealSelect('endDate', 'last-meal');
    generateMealTable();
    generateAllJoinMealTable();
    toggleFields();
    document.getElementById('startDate').addEventListener('change', () => {
        updateMealSelect('startDate', 'first-meal');
        generateMealTable();
    });
    document.getElementById('endDate').addEventListener('change', () => {
        updateMealSelect('endDate', 'last-meal');
        generateMealTable();
    });
    document.getElementById('first-meal').addEventListener('change', generateMealTable);
    document.getElementById('last-meal').addEventListener('change', generateMealTable);
});
// 「全キャンセル」ボタンで下のフォームを非表示
function handleCancelAll() {
    // 参加状況セレクトとその下のフォームのみ非表示
    document.getElementById('GOBACK').style.display = 'none';
    document.querySelector('label[for="GOBACK"]').style.display = 'none';
    document.getElementById('partialFields').style.display = 'none';
    document.getElementById('partialFields2').style.display = 'none';
}
document.getElementById('btn-cancel').addEventListener('click', handleCancelAll);
function addpeople() {
    // 申込者を増やすボタンで#partialFields4～#partialFields14を順に表示
    for (let i = 4; i <= 14; i++) {
        const el = document.getElementById('partialFields' + i);
        if (el && el.style.display === 'none') {
            el.style.display = 'block';
            break;
        }
    }
}

function rempeople() {
    // 申込者を減らすボタンで#partialFields14～#partialFields4を逆順で一番最後に表示されているものを非表示
    for (let i = 14; i >= 4; i--) {
        const el = document.getElementById('partialFields' + i);
        if (el && el.style.display === 'block') {
            el.style.display = 'none';
            break;
        }
    }
}

// nextpage関数とフォーム復元機能を追加

// URLパラメータからフォームデータを復元する関数
function restoreFormFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    // パラメータがない場合は何もしない
    if (params.toString() === '') return;
    
    // テキスト、メール、数値、日付入力を復元
    params.forEach((value, key) => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'radio') {
                // ラジオボタンは name で探す
                const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else if (element.tagName === 'SELECT') {
                element.value = value;
            } else {
                element.value = value;
            }
        }
    });
    
    // ラジオボタンの復元（name属性で検索）
    params.forEach((value, key) => {
        const radios = document.querySelectorAll(`input[name="${key}"]`);
        if (radios.length > 0) {
            radios.forEach(radio => {
                if (radio.value === value) {
                    radio.checked = true;
                }
            });
        }
    });
}

// 次へ進むボタンの処理
function nextpage() {
    // 必須項目のチェック
    const requiredFields = [
        'family-name', 'family-kana', 'first-name', 'first-kana', 
        'birthday', 'age', 'email-address', 'zipcode', 'address', 'addressNum'
    ];
    
    for (const field of requiredFields) {
        const el = document.getElementById(field);
        if (!el || !el.value) {
            alert('必須項目を全て入力してください');
            return;
        }
    }
    
    // 性別チェック
    if (!document.querySelector('input[name="gender"]:checked')) {
        alert('性別を選択してください');
        return;
    }
    
    // 申込種別チェック
    const entryType = document.querySelector('input[name="entryType"]:checked');
    if (!entryType) {
        alert('申込種別を選択してください');
        return;
    }
    
    // 申込種別が「全キャンセル」でない場合のみ参加状況をチェック
    if (entryType.value !== 'cancel') {
        const goback = document.getElementById('GOBACK');
        if (!goback || goback.value === 'none' || goback.value === '') {
            alert('参加状況を選択してください');
            return;
        }
    }
    
    // フォームデータを収集
    const params = new URLSearchParams();
    
    // テキスト入力、日付、数値、メールなど
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], input[type="date"]').forEach(el => {
        if (el.id && el.value) {
            params.append(el.id, el.value);
        }
    });
    
    // ラジオボタン（有効・無効の両方）
    document.querySelectorAll('input[type="radio"]:checked').forEach(el => {
        params.append(el.name, el.value);
    });
    
    // セレクトボックス
    document.querySelectorAll('select').forEach(el => {
        if (el.id && el.value) {
            params.append(el.id, el.value);
        }
    });
    
    // 確認ページに遷移
    window.location.href = 'confirmation.html?' + params.toString();
}

// DOMContentLoaded時の処理を更新
window.addEventListener('DOMContentLoaded', () => {
    // URLパラメータからフォームデータを復元
    restoreFormFromURL();
    
    // 既存の初期化
    renderExtraApplicants(4, 10);
    updateExtraAges();
    updateAgeAtCamp();
    
    // 参加状況の初期化
    const gobackSelect = document.getElementById('GOBACK');
    if (gobackSelect && gobackSelect.value) {
        toggleFields();
        
        if (gobackSelect.value === 'MiddleCameBack') {
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            
            if (startDate && startDate.value) {
                updateMealSelect('startDate', 'first-meal');
            }
            if (endDate && endDate.value) {
                updateMealSelect('endDate', 'last-meal');
            }
            
            // 少し遅延させて食事テーブルを生成（select要素の準備を待つ）
            setTimeout(() => {
                generateMealTable();
            }, 100);
        } else if (gobackSelect.value === 'All') {
            generateAllJoinMealTable();
        }
    } else {
        // デフォルトのテーブル生成
        updateMealSelect('startDate', 'first-meal');
        updateMealSelect('endDate', 'last-meal');
        generateMealTable();
        generateAllJoinMealTable();
    }
    
    // 申込種別の表示を復元
    const entryTypeChecked = document.querySelector('input[name="entryType"]:checked');
    if (entryTypeChecked) {
        updateEntryType();
        
        // 新規申し込みで追加申込者がいる場合、表示を復元
        if (entryTypeChecked.value === 'new') {
            const partialFields3 = document.getElementById('partialFields3');
            if (partialFields3) {
                partialFields3.style.display = 'block';
            }
            
            for (let i = 4; i <= 14; i++) {
                const nameField = document.getElementById(`first-name${i}`);
                if (nameField && nameField.value) {
                    const partialField = document.getElementById(`partialFields${i}`);
                    if (partialField) {
                        partialField.style.display = 'block';
                    }
                }
            }
        }
    }
    
    // イベントリスナーの登録
    document.getElementById('GOBACK').addEventListener('change', toggleFields);
    document.getElementById('entryTypeGroup').addEventListener('change', updateEntryType);
    
    document.getElementById('startDate').addEventListener('change', () => {
        updateMealSelect('startDate', 'first-meal');
        generateMealTable();
    });
    document.getElementById('endDate').addEventListener('change', () => {
        updateMealSelect('endDate', 'last-meal');
        generateMealTable();
    });
    document.getElementById('first-meal').addEventListener('change', generateMealTable);
    document.getElementById('last-meal').addEventListener('change', generateMealTable);
});