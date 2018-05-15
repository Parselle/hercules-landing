

<? 
    // ----------------------------конфигурация-------------------------- // 
    
    $adminemail="a.ilyin@hercules.su";  // e-mail админа
    $date=date("d.m.y"); // число.месяц.год 
    $time=date("H:i"); // часы:минуты:секунды 
    $backurl= "http://hercules.agency";  // На какую страничку переходит после отправки письма 
    
    // Принимаем данные с формы 
    
    $name = $_POST['name']; 
    $phone = $_POST['phone']; 

    
    // Проверяем валидность e-mail 
    
    $msg=" 
        Имя: $name
        Телефон: $phone
        --------
        Дата: $date
        Время: $time
    "; 

    // Отправляем письмо админу  

    mail("$adminemail", "Вопрос  
    с сайта hercules.agency", "$msg"); 

    // Выводим сообщение пользователю 

    print "<script language='Javascript'><!-- 
    function reload() {location = \"$backurl\"}; setTimeout('reload()', 2000); 
    //--></script> 
    
    <p>Сообщение отправлено! Подождите, сейчас вы будете перенаправлены назад...</p>";  
    exit; 
 
?>