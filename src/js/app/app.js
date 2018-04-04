
/* |--> app/app.js */

$( document ).ready(function() {

    class Menu {
        constructor(hamburger, menu, link) {
            this.hamburger = hamburger;
            this.menu = menu;
            this.link = link;
        }

        menu_control() {
            $(this.hamburger).on('click', () => {
                $(this.hamburger).toggleClass("active");
                $('.hamburger__bar').toggleClass('animate');
                $(this.menu).toggleClass("active");
            });

            $(this.link).on("click", (e) => {
                let target = $(e.target);
                let anchor = target;
                $(this.link).removeClass("active");
                $(this.menu).removeClass("active");
                $(this.hamburger).removeClass("active");
                
                $('html, body').stop().animate({
                    scrollTop: ($(anchor.attr('href')).offset().top) -   parseInt($(topMenu.menu).height())
                }, 777);
                e.preventDefault();
                return false;
            });
        }

    }

    class Modal {
        constructor() {
            this.inputs = {
                name: `
                    <div class="c-form__block">
                        <label for="name">Ваше имя</label>
                        <input class="c-input" id="name" type="text" name="Lead[name]">
                    </div>`,
                tel: `
                    <div class="c-form__block">
                        <label for="phone">Ваш телефон</label>
                        <input class="c-input" id="phone" type="tel" name="Lead[phone]">
                    </div>`
            }
        }

        gen(type) {

            let str = `
            <div class="c-modal">
                <div class="c-modal__box">
                    <div class="c-modal__close">
                        x
                    </div>
                    <form class="contacts__form c-form" action="" method="post" onsubmit="validateform(this); return false;">`

            switch (type) {
                case "client":
                str += `
                    <h2 class="c-form__title">
                        ХОТИТЕ ПОЛУЧИТЬ КЛИЕНТОВ
                        <span class="not-bold blue">МЫ ВАМ ПОМОЖЕМ</span>
                    </h2>`;
                str += this.inputs.name + this.inputs.tel;
                break;

                default:
                return false;
            }

            str += `
                <input class="c-btn" type="submit" value="ПОЛУЧИТЬ КЛИЕНТОВ">
                </form>
            </div>
            </div>`;

            $("body").append(str);
        }
    }

    //Initialize

    let topMenu = new Menu('.header__hamburger', '.header__nav', '.nav__item');
    topMenu.menu_control();

    $("body").on("click", (e) => {
        let target = $(e.target);
        if(target.attr("data-modal")) {
            modal.gen(target.attr("data-modal"));
        }
        if(target.is(".c-modal__close")) {
            $(".c-modal").remove();
        }
    });

    let modal = new Modal();

    $('input[name="Lead[phone]"]').mask("8 999 999 99 99"); //Fot telephone mask

});