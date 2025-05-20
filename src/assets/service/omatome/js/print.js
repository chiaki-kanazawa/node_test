<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script>
$(function(){
 
    //¸ÄÊÌ°õºþÍÑ
    $('.print-btn').on('click', function(){
        var printPage = $(this).closest('.print-page').html();
        $('body').append('<div id="print"></div>');
        $('#print').append(printPage);
        $('body > :not(#print)').addClass('print-off');
        window.print();
        $('#print').remove();
        $('.print-off').removeClass('print-off');
    });
 
    //°ì³ç°õºþÍÑ
    $('.print-all').on('click', function(){
        window.print();
    });
 
});
</script>