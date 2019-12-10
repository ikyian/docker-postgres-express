$(function(){
    $(".check-box").on('click', function(evt){
        console.log(evt);
        var $target = $(evt.currentTarget);
        var checked = $target.hasClass('checked');
        var name = $target.data('name');
        $('.check-box[data-name="' + name + '"]').removeClass('checked');
        if(!checked){
            $target.addClass('checked');
        }
    });

    $('.btn-check').on('click', function(){
        var $option = $('.check-box.checked[data-name="option"]');
        var value = $option.length > 0 ? $option.data('value') : undefined;
        console.log('option: ' + value);

        $option = $('.check-box.checked[data-name="option-2"]');
        value = $option.length > 0 ? $option.data('value') : undefined;
        console.log('option-2: ' + value);
    });
});
