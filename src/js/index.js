import "../styles/style.scss";
import {validatorInput} from "./functions/validator";


const inputsJSON = require("../assets/JSON/inputs.JSON");
const form = document.querySelector(".application-form");
const APIKey = "AIzaSyAO_dEJUkjA5HgFptojG2pziUNg-URs3Go";

if(Array.isArray(inputsJSON.inputs)) {

    const wrapperInput = form.querySelector(".application-form__input-wrapper");

    inputsJSON.inputs.map((input) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("application-form__input-wrapper");
        let label;

        // Создаётся input range иначе создаётся обычный инпут
        if(input.type === "range") {
            // Формирование ренжа
            label = document.createElement("div");
            label.setAttribute("class", "lable application-form__lable application-form__lable_type_range");

            const placeholder = document.createElement("span");
            placeholder.textContent = input.placegolder;
            placeholder.classList.add("lable__placeholder");

            const slide = document.createElement("div");
            slide.classList.add("slider-range");

            const inputTag = document.createElement("input");
            inputTag.classList.add("slider-range__range");
            inputTag.name = input.name;
            inputTag.type = input.type;
            inputTag.id = input.name;

            const progressBar = document.createElement("div");
            progressBar.classList.add("slider-range__progress");

            slide.append(inputTag);
            slide.append(progressBar);

            label.prepend(placeholder);
            label.append(slide);

            wrapperInput.append(label);

            // Определение элементов' и начального значения
            const slider = document.querySelector('.slider-range__range');
            const progress = document.querySelector('.slider-range__progress');
            slider.value = localStorage.getItem(inputTag.name) ? localStorage.getItem(inputTag.name) : 25;
            progress.style.width = localStorage.getItem(inputTag.name) ? localStorage.getItem(inputTag.name)+"%" : 25 +"%";

            slider.oninput = function (){
                progress.style.width = `${this.value}%`;
            };

            // Магнит для полосы рэнжа к контрольным точкам
            slider.addEventListener("mouseup", (e) => {
                switch (true) {
                    case e.target.value >= 0 && e.target.value <= 12:
                        progress.style.width = `0%`;
                        e.target.value = 0;
                        break;
                    case e.target.value >= 13 && e.target.value <= 37:
                        progress.style.width = `25%`;
                        e.target.value = 25;
                        break;
                    case e.target.value >= 38 && e.target.value <= 62:
                        progress.style.width = `50%`;
                        e.target.value = 50;
                        break;
                    case e.target.value >= 63 && e.target.value <= 87:
                        progress.style.width = `75%`;
                        e.target.value = 75;
                        break;
                    default:
                        progress.style.width = `100%`;
                        e.target.value = 100;
                }
                localStorage.setItem(inputTag.name, e.target.value);
            })

        } else {
            label = document.createElement("label");
            label.setAttribute("class", "lable application-form__lable");
            label.for = input.name;

            const placeholder = document.createElement("span");
            placeholder.textContent = input.placegolder;
            placeholder.classList.add("lable__placeholder");

            const inputTag = document.createElement("input");
            inputTag.classList.add("input");
            inputTag.name = input.name;
            inputTag.type = input.type;
            inputTag.id = input.name;
            inputTag.value = localStorage.getItem(inputTag.name);

            label.prepend(placeholder);
            label.append(inputTag);
            if(input.name === "address") {
                let locate = document.createElement("span");
                locate.classList.add("lable__locate");
                label.append(locate);
            }

            wrapperInput.append(label);


            // Установка класса focus для placegolder'ов
            if(inputTag.value !== "") placeholder.classList.add("focus");
            inputTag.addEventListener("focus",() => {
                placeholder.classList.add("focus");
                placeholder.setAttribute("style", "color: #462DC8;");
                if(inputTag.name === "dateOfBirth") inputTag.placeholder = "ДД.ММ.ГГГГ";
            });

            // По нажатию кнопки значение запоминается в LocalStorage
            inputTag.addEventListener("keyup", (e) => {
                localStorage.setItem(inputTag.name, inputTag.value);
            })

            inputTag.addEventListener("blur",() => {
                placeholder.removeAttribute("style");
                if(inputTag.value.trim() === "") placeholder.classList.remove("focus");
                if(inputTag.name === "dateOfBirth") inputTag.placeholder = "";
            });
        }
    })


    // Определение радио кнопок, запись их в Локальное Хранилище, присваивание начального значения
    const electroBookInput = document.querySelector("#radio_el");
    const paperBookInput = document.querySelector("#radio_pap");

    electroBookInput.addEventListener("change", () => {
        localStorage.setItem("jobBook", "Элуктронная");
    })

    paperBookInput.addEventListener("change", () => {
        localStorage.setItem("jobBook", "Бумажная");
    })

    if(localStorage.getItem("jobBook") === "Элуктронная" || !localStorage.getItem("jobBook")) {
        electroBookInput.checked = true;
        localStorage.setItem("jobBook", "Элуктронная");
    } else {
        paperBookInput.checked = true;
        localStorage.setItem("jobBook", "Бумажная");
    }



    // Получение геопозиции по IP
    const geo = document.querySelector(".lable__locate");

    geo.addEventListener("click", () => {
        let ip, city;
        // Получаю в запросе IP пользователся
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => {
                ip = data.ip;

                // Запрос для получения местоположения по IP
                fetch(`http://ipwhois.app/json/${ip}`)
                    .then(res => res.json())
                    .then(data => {
                        city = data.city;

                        // Подставляется определённый город в input
                        document.querySelector("#address").value = city;
                        localStorage.setItem("address", city);

                        // Запрос в Гугл для подставления в input валидного адресса
                        // ПРИХОДИТ ОШИБКА ИЗ-ЗА ОТСУТСТВИЯ ТОКЕНА
                        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${APIKey}`)
                            .then(res => res.json())
                            .then(data => console.log(data))
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

    });

    // Сбор value из input'ов и формирование из них объекта с выводом его в консоль
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let inputs = Array.from(form.elements);

        let valueObj = {};

        const listErrors = document.querySelector(".errors-list");

        // Отчищает список ошибок
        while (listErrors.firstChild) {
            listErrors.removeChild(listErrors.firstChild);
        }

        inputs.map((input) => {
            if(input.name === "") return;
            if(input.type === "radio") {
                if(input.checked) {
                    valueObj[input.name] = input.value;
                }
                else return;
            }
            else {
                valueObj[input.name] = input.value;
            }
        });


        // Провекрка по регулярным выражениям значений в полях, в случае ошибки записывается в массив ошибок
        let messageErrors = [];
        messageErrors.push(validatorInput(valueObj.phoneNumber, /\+?\d{11}/i, "Номер телефона должн быть в формате \"+79998887766\"" ));
        messageErrors.push(validatorInput(valueObj.name, /[а-яА-я]+ [а-яА-я]+ [а-яА-я]+/i, "ФИО — должно быть в формате \"Иванов Иван Иванович\""));
        messageErrors.push(validatorInput(valueObj.email, /[\w+.]+\w+@\w+.[a-z]+/i, "Не корректный емэйл адресс"));
        messageErrors.push(validatorInput(valueObj.dateOfBirth, /\d{2}.\d{2}.\d{4}/i, "Дата должна быть в формате \"ДД.ММ.ГГГГ\"" ));

        // Выводит список ошибок под кнопку
        messageErrors.filter(i => i !== "ok").map(error => {
            const errorItem = document.createElement("li");
            errorItem.classList.add("errors-list__error");
            errorItem.textContent = error;
            listErrors.append(errorItem);
        });

        if(!messageErrors.filter(i => i !== "ok").length) console.log(valueObj);
    })


}