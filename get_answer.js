var fs = require("fs");
var reg_exps = JSON.parse(fs.readFileSync("phrases.json"));
var state = null;

const LANDIND_CONSULT = 'консультация по лэндингу';
const CMS_CONSULT = 'консультация по CMS';
const COMPL_APPS_CONSULT = 'консультация по сложным веб-приложениям';
const WRITE_APP_CONSULT ='консультация по самостоятельной разработке';
const TEMPLATE_CONSULT = 'консультация по шаблонам и фреймворкам';
const CONSTR_CONSULT = 'консультация по конструкторам сайтов';

function is_number(value) {
    return !isNaN(value.toString().trim());
}

function save_result(result, time, user) {
    if(!fs.existsSync("result.txt")) {
        fs.openSync("result.txt", 'a')
        fs.closeSync("result.txt")
    }

    var current_content = fs.readFileSync("result.txt", "utf8");
    if(!current_content.trim()) {
        fs.writeFileSync("result.txt", "date result user_id first_name last_name user_name\r\n");
    }
    var last_name = user.last_name?user.last_name:'', user_name =  user.username?user.username:'';
    var loggin_message = time+'# '+result+'# '+user.id+'# '+user.first_name+'# '+last_name+'# '+user_name;

    fs.appendFile("result.txt", loggin_message+' \r\n', function(error){
        if(error) throw error;
        var data = fs.readFileSync("result.txt", "utf8");
    });

}

module.exports.get_answer = function(text, time, user) {
    var answer_text = 'К сожалению, затрудняюсь ответить', is_answered = false;
    if((new RegExp(reg_exps['hi'])).test(text) && !is_answered) {
        answer_text = 'Здравствуйте. Чему могу Вам помочь?';
        is_answered = true;
    }

    if((new RegExp(reg_exps['site_build_request'])).test(text) && !is_answered) {
        state = 'site_type_request';
        answer_text = 'Какой сайт Вы хотите сделать? Выберите один из четырех вариантов ответа.\n'+
            '\t1. Одностраничный сайт, сайт-визитка;\n'+
            '\t2. Лэндинг;\n'+
            '\t3. Сайт с использованием CMS;\n'+
            '\t4. Сложное веб-приложение, веб-портал;.\n';
        is_answered = true;
    }

    if(is_number(text) && !is_answered) {
        var answer_number = parseInt(text);
        if (state ==  'site_type_request') {
            if(answer_number == 1 && !is_answered) {
                answer_text = 'Вы хорошо знакомы с HTML/CSS/JS и имеются ли у Вас навыки дизайна?';
                state = 'simplesite_question_level_1';
                is_answered = true;
            }
            if(answer_number == 2 && !is_answered) {
                answer_text = 'Лэндинги сейчас разрабатываются с использованием конструкторов. \n'+
                    'Конструкторы лэндигов: \n'+
                    'http://lpmotor.ru/ \n'+
                    'https://lpgenerator.ru/ \n'+
                    'https://platformalp.ru/ \n'+
                    'http://tilda.cc/ru/ \n'+
                    'https://flexbe.ru/ \n'+
                    'Удачи!';
                state = null;
                is_answered = true;
                save_result(LANDIND_CONSULT, time, user);
            }

            if(answer_number == 3 && !is_answered) {
                answer_text = 'Наиболее популярные CMS \n'+
                    'https://www.1c-bitrix.ru/ \n'+
                    'https://ru.wordpress.org/\n'+
                    'https://www.joomla.org/ \n'+
                    'ui-cms.com \n'+
                    'Удачи!';
                state = null;
                is_answered = true;
                save_result(CMS_CONSULT, time, user);
            }

            if(answer_number == 4 && !is_answered) {
                answer_text = 'Для разработки сложных веб-приложений и порталов используются следующие фрейворки: \n'+
                    'http://laravel.com/ (PHP) \n'+
                    'http://yiiframework.com/ (PHP) \n'+
                    'https://spring.io/ (Java) / \n'+
                    'https://www.asp.net/ (C#) \n'+
                    'Удачи!';
                state = null;
                is_answered = true;
                save_result(COMPL_APPS_CONSULT, time, user);
            }
        }
    }

    if((new RegExp(reg_exps['yes'])).test(text) && !is_answered) {
        if (state == 'simplesite_question_level_1' && !is_answered) {
            answer_text = 'Готовы ли Вы потратить больше одного дня на создание сайта?';
            state = 'simplesite_question_good_experience_level_1';
            is_answered = true;
        }
        if (state == 'simplesite_question_good_experience_level_1' && !is_answered) {
            answer_text = 'Тогда разрабатывайте сайт самостоятельно без фреймворков, CMS и библиотек.\n'+
                'В итоге у Вас получится сайт, сделанный конкретно под Ваши требования и умеющий уникальный дизайн.\n'+
                'Удачи!';
            state = null;
            is_answered = true;
            save_result(WRITE_APP_CONSULT, time, user);
        }
    }

    if((new RegExp(reg_exps['no'])).test(text) && !is_answered) {
        if (state == 'simplesite_question_good_experience_level_1' && !is_answered) {
            answer_text = 'Тогда Вам следует использовать шаблон или фреймворк.\n'+
                'Шаблоны бывают платными и бесплатными. Сайты с платными шаблонами в интернете встречаются реже, чем с бесплатными.\n'+
                'Следовательно, выбирая платный шаблон, может увеличиться уникальность дизайна.\n'+
                'Но для  повышения уникальности дизайна также можно отредактировать бесплатный шаблон.\n'+
                'Шаблоны можно скачать с данных сайтов:\n'+
                'http://html-template.ru/ \n'+
                'http://www.tooplate.com/ \n'+
                'https://templated.co/ \n'+
                'https://html-templates.info/ \n'+
                'Популярные фреймворки: \n'+
                'http://getbootstrap.com/ \n'+
                'https://purecss.io/ \n'+
                'https://gumbyframework.com/'+
                'https://metroui.org.ua/'+
                'Удачи!';
            state = null;
            is_answered = true;
            save_result(TEMPLATE_CONSULT, time, user);
        }

        if (state == 'simplesite_question_level_1' && !is_answered) {
            answer_text = 'Тогда Вам следует использовать конструктор сайтов.\n'+
                'Для улучшения уникальности дизайна можно обратиться к веб-дизайнеру.\n'+
                'Конструкторы сайтов:\n'+
                'http://ru.wix.com/ \n'+
                'http://nethouse.ru/ \n'+
                'https://ukit.com \n'+
                'https://umi.ru/ \n'+
                'https://www.jimdo.com/ \n'+
                'https://www.redham.ru \n'+
                'http://www.setup.ru  \n'+
                'https://www.ucoz.ru  \n'+
                'Удачи!';
            state = null;
            is_answered = true;
            save_result(CONSTR_CONSULT, time, user);
        }
    }
    return answer_text;
}