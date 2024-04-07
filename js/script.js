document.addEventListener('DOMContentLoaded', function(){

    // slider
    let swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: "#my-controls .my-swiper-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: "#my-controls .my-swiper-button-next",
            prevEl: "#my-controls .my-swiper-button-prev",
        },

    });
    const form = document.querySelector("#modal-lead"),
        formContainer = document.querySelector('.modal-form-container'),
        buttonCallForm = document.querySelectorAll('[data-target=modal]'),
        userMsg = document.querySelector('.user_msg'),
        closeBtn = document.querySelector('[data-target=close-modal]');

    //Event form send
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        trySendForm();
    });

    closeBtn.addEventListener('click',(event) => {
        formContainer.classList.add('d-none');
    });

    // Add call modal to each btn
    buttonCallForm.forEach(btn =>{
        btn.addEventListener('click', (event)=>{
            event.preventDefault();
            formContainer.classList.remove('d-none');
        });
    });

    // Close modal if click outside form container
    formContainer.addEventListener('click', (event) => {
        const isFormCont = event.target.className === 'modal-form-container';

        if(isFormCont){
            formContainer.classList.add('d-none');
        }
    });

    function trySendForm(){
        const formData = new FormData(form);
        let validForm = validateForm(formData);

        hideFormErr();
        if(validForm.valid){
            sendData(formData);
        }else{
            displayFormErr(validForm.err);
        }

    }
    //send data async
    async function sendData(formData) {
        try {
            const response = await fetch("/php/send.php", {
                method: "POST",
                body: formData,
            })
            const data = await response.json();
            displayServerMsg(data);
        }
        catch (err) {
            console.log(err);
        }
    }
    function validateForm(formData) {
        let res = {'valid':false, 'err':{}},
            regName = new RegExp("^[A-zА-яЁё]+$"),
            regPhone = new RegExp('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$'),
            formField = Object.fromEntries(formData.entries());

        for (const [key, value] of Object.entries(formField)) {
            switch(key) {
                case 'user_name':
                    if(!(regName.test(value))){
                        res.err.name = 'Для имени допустимы только буквы';
                    }
                    break;

                case 'user_phone':
                    if(!(regPhone.test(value))){
                        res.err.phone = 'Проверьте правильность номера';
                    }
                    break;
            }

        }
        if(Object.keys(res.err).length === 0){
            res.valid = true;
        }

        return res;

    }

    function displayFormErr(msg) {
        let nameErr = form.querySelector('#nameErr'),
            phoneErr = form.querySelector('#phoneErr');

        if(msg.hasOwnProperty('name')) {
            nameErr.innerHTML = msg.name;
            nameErr.classList.remove('d-none');
        }
        if(msg.hasOwnProperty('phone')){
            phoneErr.innerHTML = msg.phone;
            phoneErr.classList.remove('d-none');
        }
    }
    function hideFormErr(){
        let nameErr = form.querySelector('#nameErr'),
            phoneErr = form.querySelector('#phoneErr');

            nameErr.classList.add('d-none');
            phoneErr.classList.add('d-none');
    }
    function displayServerMsg(res) {
        let msg = '';

        if(res.hasOwnProperty('status')){
            if(res.status == 'send'){
                msg = '<div class="text-success py-3 text-center fs-4 fw-bold">Сообщение отправлено</div>'
            }else{
                msg = res.error;
            }
        }else{
            msg = '<div class="text-danger py-3 text-center fs-4 fw-bold">Что-то пошло не так, свяжитесь с нами по телефону</div>'
        };

        form.classList.add('d-none');
        userMsg.innerHTML = msg;
        userMsg.classList.remove('d-none');

        setTimeout(hideServerMsg, 5000);
    }
    function hideServerMsg(){
        userMsg.classList.add('d-none');
        form.classList.remove('d-none');
    }
});