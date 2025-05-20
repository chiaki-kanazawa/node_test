/**
 * カルーセルクラス
 */
export class Carousel {
    /** カルーセル本体 */
    #carousel;

    /** スライド配列 */
    #slides;

    /** 表示中スライド */
    #current;

    /** 左スライド */
    #left;

    /** 右スライド */
    #right;

    /** 控えスライド */
    #buff;

    /** スライド間距離 */
    #distance;

    /** 表示中スライドの左端座標 */
    #currentLeft;

    /**
     * 移動方向
     */
    static direction = {
        left: "left",
        right: "right",
    };

    /**
     * コンストラクタ
     * @param {element} carousel カルーセル要素
     */
    constructor(carousel) {
        this.#carousel = carousel;

        // スライドの設置と表示
        this.#current = this.#carousel.querySelector(".current");
        this.#left = this.#getLeft(this.#current);
        this.#right = this.#getRight(this.#current);
        this.#current.style.display = "block";
        this.#left.style.display = "block";
        this.#right.style.display = "block";

        this.init();
    }

    /**
     * 初期化する。
     */
    init() {
        const frameHeight = this.#carousel.querySelector(".carousel-frame").getBoundingClientRect().height;
        const content = this.#carousel.querySelector(".carousel-content");
        const contentWidth = parseFloat(window.getComputedStyle(this.#carousel).width);
        content.style.width = `${contentWidth}px`;
        content.style.height = `${frameHeight * 0.77}px`;
        content.style.top = `${73 + frameHeight * 0.05}px`;

        this.#slides = [...this.#carousel.querySelectorAll(".slide")];
        this.#slides.forEach(slide => (slide.style.height = content.style.height));

        // スライド間距離算出
        const currentSlideWidth = parseFloat(window.getComputedStyle(this.#current).width);
        const currentSlideMargin = parseFloat(window.getComputedStyle(this.#current).marginLeft);
        this.#distance = currentSlideWidth + currentSlideMargin * 3;

        // スライド位置調整
        this.#currentLeft = (contentWidth - currentSlideWidth) / 2 - currentSlideMargin;
        this.initSlidePosition();
    }

    /**
     * スライド位置を初期化する。
     */
    initSlidePosition() {
        this.#current.style.left = `${this.#currentLeft}px`;
        this.#left.style.left = `${this.#currentLeft - this.#distance}px`;
        this.#right.style.left = `${this.#currentLeft + this.#distance}px`;
    }

    /**
     * 引数方向へスライドを移動させる。
     * @param {Carousel.direction} direction 移動方向
     */
    async move(direction) {
        const IN_PROCESS = "in-process";

        if (this.#carousel.classList.contains(IN_PROCESS)) {
            return;
        } else {
            this.#carousel.classList.add(IN_PROCESS);
        }

        // 移動距離倍率
        let rate = 0;

        if (direction === Carousel.direction.left) {
            rate = -1;
            this.#buff = this.#getRight(this.#right);
        } else if (direction === Carousel.direction.right) {
            rate = 1;
            this.#buff = this.#getLeft(this.#left);
        } else {
            this.#carousel.classList.add(IN_PROCESS);
            return;
        }

        // バッファスライド
        this.#buff.style.left = `${this.#currentLeft + this.#distance * -2 * rate}px`;
        this.#buff.style.display = "block";

        // アニメーション
        const keyframe = [{transform: `translateX(0)`}, {transform: `translateX(${this.#distance * rate}px)`}];
        const options = {duration: 500, fill: "forwards"};
        const slides = [this.#buff, this.#left, this.#current, this.#right];
        slides.forEach(slide => slide.animate(keyframe, options));
        const animations = slides.reduce((previous, current) => [...previous, ...current.getAnimations()], []);
        await Promise.all(animations.map(animation => animation.finished));

        // スタイル固定
        animations.forEach(animation => {
            animation.commitStyles();
            animation.cancel();
        });
        slides.forEach(slide => {
            slide.style.transform = "translateX(0)";
        });

        // 表示スライド更新
        if (direction === Carousel.direction.left) {
            this.#left.style.display = "none";
            this.#left = this.#current;
            this.#current = this.#right;
            this.#right = this.#buff;
            this.#buff = null;
        } else if (direction === Carousel.direction.right) {
            this.#right.style.display = "none";
            this.#right = this.#current;
            this.#current = this.#left;
            this.#left = this.#buff;
            this.#buff = null;
        }
        this.initSlidePosition();

        this.#carousel.classList.remove(IN_PROCESS);
    }

    /**
     * 左隣の兄弟要素を取得する。存在しなければ最後の兄弟要素を取得する。
     * @param {Element} slide スライド要素
     * @returns {Element} 左隣の兄弟要素
     */
    #getLeft(slide) {
        return slide.previousElementSibling || this.#slides.at(-1);
    }

    /**
     * 右隣の兄弟要素を取得する。存在しなければ最初の兄弟要素を取得する。
     * @param {Element} slide スライド要素
     * @returns {Element} 右隣の兄弟要素
     */
    #getRight(slide) {
        return slide.nextElementSibling || this.#slides.at(1);
    }
}
