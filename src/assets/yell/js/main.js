import {Carousel} from "./modules/carousel.mjs";

let carousel;

function detectSwipe(elm) {
    let startX;
    let moveX;
    let minDistance = 50;

    elm.addEventListener("touchstart", e => (startX = e.touches[0].pageX), {passive: true});
    elm.addEventListener("touchmove", e => (moveX = e.changedTouches[0].pageX), {passive: true});
    elm.addEventListener("touchend", e => {
        if (moveX < startX - minDistance) {
            elm.dispatchEvent(new Event("leftswipe"));
        } else if (startX + minDistance < moveX) {
            elm.dispatchEvent(new Event("rightswipe"));
        }
    });
}

window.addEventListener("load", () => {
    // lottieアニメーション
    const initLottieAnimations = () => {
        const lottieAnimations = document.querySelectorAll(".lottie");
        lottieAnimations.forEach(animation => {
            const path = animation.getAttribute("data-source");
            lottie.loadAnimation({
                container: animation,
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: path,
            });
        });
    };
    initLottieAnimations();

    // タブ切替
    const initTabs = () => {
        const tabs = document.querySelectorAll(".tab");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // 既にオンのときは何もしない
                if (!tab.classList.contains("on")) {
                    const dataTab = tab.getAttribute("data-tab");
                    const root = tab.closest(".tab-area");
                    const onElms = root.querySelectorAll(".on");
                    onElms.forEach(e => {
                        e.classList.remove("on");
                    });

                    const targets = root.querySelectorAll(`[data-tab="${dataTab}"`);
                    targets.forEach(e => {
                        e.classList.add("on");
                    });
                }
            });
        });
    };
    initTabs();

    // Xボタン
    const initSnsBtns = () => {
        const snsBtns = document.querySelectorAll(".button-x");
        snsBtns.forEach(btn => {
            btn.addEventListener("pointerdown", () => {
                btn.setAttribute("src", btn.getAttribute("data-active-image"));
            });
            btn.addEventListener("pointerup", () => {
                btn.setAttribute("src", btn.getAttribute("data-default-image"));
            });
            btn.addEventListener("pointerout", () => {
                btn.setAttribute("src", btn.getAttribute("data-default-image"));
            });
        });
    };
    initSnsBtns();

    // 自己紹介
    const initIntroduce = () => {
        const observeOptions = {
            root: null,
            rootMargin: "0px 0px -20% 0px",
            threshold: 0,
        };
        const callback1 = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.animate(
                        {opacity: [0, 1], transform: ["scale(0)", "scale(1)"]},
                        {duration: 100, fill: "forwards"}
                    );
                    observer.unobserve(entry.target);
                }
            });
        };
        const callback2 = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.animate(
                        {opacity: [0, 1], transform: ["scale(0)", "scale(1)"]},
                        {duration: 100, fill: "forwards", delay: 500}
                    );
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer1 = new IntersectionObserver(callback1, observeOptions);
        const observer2 = new IntersectionObserver(callback2, observeOptions);

        observer1.observe(document.querySelector(".universe .characters .balloon.eru"));
        observer2.observe(document.querySelector(".universe .characters .balloon.buibui"));
    };
    initIntroduce();

    // チャット
    const initChat = () => {
        const observeOptions = {
            root: null,
            rootMargin: "0px 0px -20% 0px",
            threshold: 0,
        };
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.animate(
                        {opacity: [0, 1], transform: ["scale(0)", "scale(1)"]},
                        {duration: 100, fill: "forwards"}
                    );
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(callback, observeOptions);
        const messages = document.querySelectorAll(".chat .row");
        messages.forEach(message => {
            observer.observe(message);
        });
    };
    initChat();

    // モーダル
    const initModal = () => {
        const IN_PROCESS = "in-process";
        const modal = document.querySelector(".menu-modal");
        const navi = modal.querySelector(".modal-navi");
        const confetti = modal.querySelector(".confetti");
        const openBtn = document.querySelector(".main-frame .button-area");
        const closeBtn = document.querySelector(".menu-modal .button-area");
        const openBtnBars = [...document.querySelectorAll(".main-frame .button-area>div")];
        const closeBtnBars = [...document.querySelectorAll(".menu-modal .button-area>div")];
        const toAnimationArray = elements => {
            return elements.reduce((previous, current) => previous.concat(current.getAnimations()), []);
        };

        // メニューボタン
        const modalBtns = document.querySelectorAll(".header > .button-area");
        modalBtns.forEach(btn => {
            btn.addEventListener("click", async () => {
                // 連打防止
                if (modal.classList.contains(IN_PROCESS)) {
                    return;
                } else {
                    modal.classList.add(IN_PROCESS);
                }

                // 閉じるとき
                if (modal.hasAttribute("open")) {
                    closeBtn.classList.add("close");
                    modal.animate([{clipPath: "circle(100%)"}, {clipPath: "circle(0%)"}], {duration: 500});
                    await Promise.all(toAnimationArray([...closeBtnBars, modal]).map(animation => animation.finished));

                    // モーダル閉じる
                    calcLayout();
                    modal.close();

                    closeBtn.classList.remove("close");

                    toAnimationArray([, navi, confetti]).forEach(animation => animation.cancel());
                    modal.classList.remove(IN_PROCESS);

                    // 開くとき
                } else {
                    openBtn.classList.add("open");

                    await Promise.all(toAnimationArray(openBtnBars).map(animation => animation.finished));

                    // モーダル開く
                    calcLayout();
                    modal.showModal();

                    modal.animate([{clipPath: "circle(0%)"}, {clipPath: "circle(100%)"}], {duration: 500});
                    navi.animate(
                        [
                            {transform: "translate(-50%, -50%) scale(0, 0)"},
                            {transform: "translate(-50%, -50%) scale(1, 1)"},
                            {transform: "translate(-50%, -50%) scale(1.3, 1.3)"},
                            {transform: "translate(-50%, -50%) scale(1, 1)"},
                        ],
                        {
                            duration: 400,
                            delay: 200,
                            fill: "forwards",
                        }
                    );
                    confetti.animate(
                        [{transform: "translateY(-200px) scale(0, 0)"}, {transform: "translateY(0) scale(1, 1)"}],
                        {
                            duration: 1000,
                            delay: 200,
                            fill: "forwards",
                            easing: "cubic-bezier(0.0, 0.8, 0.2, 1.0)",
                        }
                    );
                    await Promise.all(toAnimationArray([modal, navi, confetti]).map(animation => animation.finished));
                    openBtn.classList.remove("open");
                }
                modal.classList.remove(IN_PROCESS);
            });
        });

        // モーダルナビ
        const modalNaviItems = modal.querySelectorAll(".navi a");
        modalNaviItems.forEach(item => {
            item.addEventListener("click", async () => {
                // 連打防止
                if (modal.classList.contains(IN_PROCESS)) {
                    return;
                } else {
                    modal.classList.add(IN_PROCESS);
                }
                // ×を≡にする
                closeBtn.classList.add("close");
                modal.animate([{clipPath: "circle(100%)"}, {clipPath: "circle(0%)"}], {duration: 500});
                await Promise.all(toAnimationArray([...closeBtnBars, modal]).map(animation => animation.finished));

                modal.close();
                toAnimationArray([, navi, confetti]).forEach(animation => animation.cancel());
                closeBtn.classList.remove("close");
                modal.classList.remove(IN_PROCESS);
            });
        });
    };
    initModal();

    // メニュー
    const initMenu = () => {
        // ページ内の位置によってメニューのアクティブ表示を切り替える
        const observeOptions = {
            root: null,
            rootMargin: "-10% 0px -80%",
            threshold: 0,
        };
        const activateIndex = elm => {
            // 現在のアクティブ状態をクリア
            const currentActiveIndexes = document.querySelectorAll(".navi .active");
            if (currentActiveIndexes.length !== 0) {
                currentActiveIndexes.forEach(index => {
                    index.classList.remove("active");
                });
            }

            // 新しい要素にアクティブ状態を設定
            const newActiveIndexes = document.querySelectorAll(`.navi a[href="#${elm.id}"]`);
            newActiveIndexes.forEach(index => {
                index.classList.add("active");
            });
        };
        const callback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activateIndex(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(callback, observeOptions);
        const sections = document.querySelectorAll(".section");
        sections.forEach(section => {
            observer.observe(section);
        });
    };
    initMenu();

    // フェードイン
    const initFadeIn = () => {
        const observeOptions = {
            root: null,
            rootMargin: "0px 0px -20% 0px",
            threshold: 0,
        };

        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.animate({opacity: [0, 0.5, 0.5, 1]}, {duration: 300, fill: "forwards"});
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(callback, observeOptions);
        const messages = document.querySelectorAll(".fade-in");
        messages.forEach(message => {
            observer.observe(message);
        });
    };
    initFadeIn();

    // カルーセル
    const initCarousel = () => {
        const caroueslElm = document.querySelector(".carousel");
        carousel = new Carousel(caroueslElm);

        const btns = caroueslElm.querySelectorAll(".control .button-carousel");
        btns.forEach(btn => {
            btn.addEventListener("pointerdown", () => {
                btn.setAttribute("src", btn.getAttribute("data-active-image"));
            });
            btn.addEventListener("pointerup", () => {
                btn.setAttribute("src", btn.getAttribute("data-default-image"));
            });
            btn.addEventListener("pointerout", () => {
                btn.setAttribute("src", btn.getAttribute("data-default-image"));
            });
            btn.addEventListener("click", () => {
                if (btn.classList.contains("left")) {
                    carousel.move(Carousel.direction.right);
                } else if (btn.classList.contains("right")) {
                    carousel.move(Carousel.direction.left);
                }
            });
        });

        const slides = caroueslElm.querySelectorAll(".slide");
        slides.forEach(slide => {
            slide.addEventListener("leftswipe", () => {
                carousel.move(Carousel.direction.left);
            });
            slide.addEventListener("rightswipe", () => {
                carousel.move(Carousel.direction.right);
            });
            detectSwipe(slide);
        });
    };
    initCarousel();

    // ロード、リサイズ毎に呼ぶ処理
    const calcLayout = () => {
        // スクロールバー幅
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
        const scrollbarWidthHalf = Math.ceil(scrollbarWidth / 2);
        document.documentElement.style.setProperty("--scrollbar-width-half", `${scrollbarWidthHalf}px`);

        // カルーセル
        carousel.init();
    };
    window.addEventListener("load", calcLayout);
    window.addEventListener("resize", calcLayout);
});
