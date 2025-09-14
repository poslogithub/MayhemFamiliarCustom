// 初期状態でcustom-inputを無効化
function initializeInputs() {
    const rows = document.querySelectorAll('#eventTable tr');
    rows.forEach(row => {
        const customRadio = row.querySelector('input[type="radio"][value="custom"]');
        const customInput = row.querySelector('.custom-input');
        if (customRadio && customInput) {
            customInput.disabled = !customRadio.checked;
        }
    });
}

// ラジオボタンの変更時にcustom-inputの有効/無効を切り替え
function handleRadioChange() {
    const radios = document.querySelectorAll('#eventTable input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            const row = this.closest('tr');
            const customInput = row.querySelector('.custom-input');
            if (customInput) {
                customInput.disabled = this.value !== 'custom';
            }
        });
    });
}

// ページ読み込み時に初期化とイベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
    initializeInputs();
    handleRadioChange();
});

function exportJSONLimited() {
    exportJSON('CustomDialogueTexts_Limited.json')
}
function exportJSONYou() {
    exportJSON('CustomDialogueTexts_You.json')
}
function exportJSONOpponent() {
    exportJSON('CustomDialogueTexts_Opponent.json')
}
function exportJSONOpponentThird() {
    exportJSON('CustomDialogueTexts_OpponentThird.json')
}


function exportJSON(filename) {
    const data = {};
    const rows = document.querySelectorAll('#eventTable tr');
    rows.forEach(row => {
        const radios = row.querySelectorAll('input[type="radio"]');
        const customInput = row.querySelector('.custom-input');
        let name;
        let mode = 'default';
        radios.forEach(radio => {
            if (radio.checked) {
                name = radio.name;
                mode = radio.value;
            }
        });
        data[name] = {
            mode: mode,
            text: customInput.value
        };
    });

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON() {
    document.getElementById('jsonFile').click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const json = JSON.parse(e.target.result);
            const rows = document.querySelectorAll('#eventTable tr');
            rows.forEach(row => {
                const radios = row.querySelectorAll('input[type="radio"]');
                const customInput = row.querySelector('.custom-input');
                const name = radios[0].name;
                if (json[name]) {
                    radios.forEach(radio => {
                        if (radio.value.toLowerCase() === json[name].mode.toLowerCase()) {
                            radio.checked = true;
                        }
                    });
                    if (customInput) {
                        customInput.value = json[name].text || '';
                        customInput.disabled = json[name].mode.toLowerCase() !== 'custom';
                    }
                    customInput.value = json[name].text;
                }
            });
        };
        reader.readAsText(file);
    }
}
