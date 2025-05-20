// 20240813定期更新で追加、https://www.lifecard.co.jp/service/insurance/pet.htmlで使用
// 【モーダル処理】
(() => {
  // ・開くボタン押下時処理
  const modalbuttons = document.querySelectorAll(".modal-button");
  modalbuttons.forEach(e => {
    // 対応するモーダルを取得
    e.addEventListener("click", () => {
      const modalmoji = e.getAttribute('data-modal'); 
      const modal = document.getElementById(modalmoji);

      // クリックで表示
      modal.style.display = 'block';
    });
  });

  // ・閉じるボタン押下時処理
  const closebuttons = document.querySelectorAll(".close");
  closebuttons.forEach(e => {
    e.addEventListener("click", () => {
      // 対応するモーダルを取得
      const modalmoji = e.getAttribute('data-modal'); 
      const modal = document.getElementById(modalmoji);

      // クリックで非表示
      modal.style.display = 'none';
    });
  });

  // ・モーダル外押下時非表示処理
  window.addEventListener('click', function (event) {
    // 自分自身がmodalというclass名があるか否か
    var modalstyutoku = event.target.classList.contains("modal");
    // モーダル押下時、先祖（親要素に）modalというclass名を持っているか
    let senzo = event.target.closest("modal");

    // 上記条件が当てはまる時且つモーダル表示されている場合、モーダル外押下時非表示
    if (modalstyutoku || senzo ) {
      const modals = this.document.querySelectorAll(".modal");
      modals.forEach(modal => {
        if (modal.style.display == 'block') {
          modal.style.display = 'none';
        }
      })
    }
  });
})();