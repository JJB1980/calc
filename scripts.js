/**
 * Created by johnbowden on 10/05/15.
 */

(function () {

    $(document).ready(function () {

        var _operator = '';
        var _single = false;
        var _result = 0;
        var _clear = true;

        // capture key events.
        $('body').keyup(function (event) {
            var char = String.fromCharCode(event.keyCode);
            var keystr = '0123456789';
            var keys = {
                107: 'plus', 109: 'minus', 111: 'div', 106: 'mult', 110: 'dec', 13: 'enter', 8: 'del',
                96: 0, 97: 1, 98: 2, 99: 3, 100: 4, 101: 5, 102: 6, 103: 7, 104: 8, 105: 9
            };
            var key = '';
            if (keystr.indexOf(char) >= 0) {
                key = char;
            }
            if (keys[event.keyCode] !== undefined) {
                key = keys[event.keyCode].toString();
            }
            //console.log(key+':'+event.keyCode+':'+char+':'+keystr.indexOf(char)+':'+keys[event.keyCode]);
            if (key !== '') {
                var el = $('#btn-'+key);
                el.mousedown();
                el.click();
                setTimeout(function () {
                    $('#btn-'+key).mouseup();
                },200);
            }
            event.stopPropagation();
        });

        // apply styling on button mouse events
        var btn = $('.btn');
        btn.mousedown(function () {
            $(this).addClass('btn-press');
        });
        btn.mouseup(function () {
            $(this).removeClass('btn-press');
        });
        btn.mouseout(function () {
            $(this).removeClass('btn-press');
        });

        // run operator events
        $('.oper').click(function () {
            var val = $('#val');
            if ( val.html() === '' &&  _clear) {
                return;
            }
            var el = $(this);
            _operator = el.attr('data-oper');
            _single = el.attr('data-single') === 'true';
            $('#operand').html(el.html());
            if (_single) {
                calc();
            } else {
                var hist = $('#history');
                if (hist.html() === '') {
                    hist.html(val.html());
                    _result = val.html();
                    val.html('');
                } else if (val.html() !== '') {
                    calc();
                }
            }
        });

        // accumulate key input
        $('.num').click(function () {
            var el = $('#val');
            el.html(el.html()+$(this).html());
        });

        // decimals.
        $('#btn-dec').click(function () {
            var el = $('#val');
            if (el.html().toString().indexOf('.') < 0) {
                el.html(el.html() + '.');
            }
        });

        // remove chars on delete key.
        $('#btn-del').click(function () {
            var el = $('#val');
            var val = el.html().split('');
            val.pop();
            el.html(val.join(''));
            if (el.html() === '') {
                _operator = '';
                $('#operand').html('');
            }
        });

        // clear inputs, result and history.
        $('#btn-clear').click(function () {
            $('#val').html('');
            $('#history').html('');
            $('#operand').html('');
            $('#result span').html('0');
            _clear = true;
        });

        $('#btn-enter').click(calc);

        var rx = /INPUT|SELECT|TEXTAREA/i;

        $(document).bind("keydown keypress", function(e){
            if( e.which == 8 ){ // 8 == backspace
                if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                    e.preventDefault();
                }
            }
        });


        // do calculation
        function calc() {
            var hist = $('#history');
            var val = $('#val');
            var op = $('#operand');
            if (_clear && op.html() === '') {
                return;
            }
            var url = "http://calctest.iesim.biz/" + _operator ;
            if (!_single) {
                if (val.html() === '') {
                    return;
                }
                url += '?op1=' + _result + '&op2=' + val.html();
                hist.html(hist.html() + $('#operand').html() + val.html());
            } else {
                if (!_clear) {
                    url += '?op1=' + _result;
                    hist.html(hist.html() + op.html() + _result);
                } else {
                    if (val.html() === '') {
                        return;
                    }
                    url += '?op1=' + val.html();
                    hist.html(hist.html() + op.html() + val.html());
                }
            }
            $.ajax({
                url: url,
                dataType: "json",
                success: function( response ) {
                    op.html('');
                    val.html('');
                    _result = response.result;
                    _clear = false;
                    $('#result span').html(_result);
                },
                error: function () {
                    $('#result span').html('ERROR');
                    setTimeout(function () {
                        $('#btn-clear').click();
                    },2000);
                }
            });
        }

    });



})();