// 當文件已經全載入至記憶體時，開始執行程式
$(document).ready(function() {

    // 清空 product-list
    console.log('ready');
    $('#product-list').empty();
    $('#page').hide()

    var items = null
    var pageCount = 20
    var showItems = (page) => {
        if (items == null) return
        var start = (page - 1) * pageCount
        var end = start + pageCount - 1
        end = end > items.length-1? items.length-1:end
        $('#product-list').empty();
        for (var i = start; i <= end; i++) {
            newItem(items[i])
        }
    }

    var newItem = (item) => {
        $img = $('<img>').attr('class', 'img-fluid item-img').attr('src', item.image)
        $h3 = $('<h3>').attr('class', 'name').text(item.name)
        $p = $('<p>').attr('class', 'price').text('NT$ ' + item.price)
        $amount = $('<p>').attr('class', 'price').text('數量: ' + item.count)
        $i = $('<i>').attr('class', 'fas fa-plus fa-3x')
        $div1 = $('<div>').attr('class', 'portfolio-item-caption-content text-center text-white')
        $div2 = $('<div>').attr('class', 'portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100')
        $div3 = $('<div>').attr('class', 'portfolio-item mx-auto').attr('data-toggle', 'modal').attr('data-target', '#portfolioModal1')
        $div4 = $('<div>').attr('class', 'col-md-6 col-lg-4')
        $div1.append($i)
        $div2.append($div1)
        $div3.append($div2).append($img).append($h3).append($p).append($amount)
        $div4.append($div3)


        

        //$item = $('<div>').attr('class', 'item').append($img).append($h3).append($p)
        // $col = $('<div>').attr('class', 'col-*').append($item)

        $('#product-list').append($div4)
    }

    var newPage = (n) => {
        var pageNum = n / 20
        pageNum = (n % 20 != 0) ? pageNum + 1 : pageNum

        $('#page-number').empty()

        $la = $('<a>').attr('class', 'page-link').attr('href', '#commerce').attr('tabindex', '-1').attr('aria-disabled', 'true').text('«').on('click', function() {
                var i = Number($('.page-item.active').children().text()) - 1
                //console.log($('.page-item.active').prev().attr('class'))
                $prev = $('.page-item.active').prev()
                $curr = $('.page-item.active')
                $prev.addClass('active')
                $curr.removeClass('active')
                //$('.page-item.active').removeClass('active')
                if (i == 1) $('.page-item.prev').addClass('disabled')
                else $('.page-item.prev').removeClass('disabled')
                if (i == maxPage) $('.page-item.next').addClass('disabled')
                else $('.page-item.next').removeClass('disabled')
                showItems(i)
            })
        $lli = $('<li>').attr('class', 'page-item disabled prev').append($la)

        $('#page-number').append($lli)

        // 插入分頁數字
        for (var i = 1; i <= pageNum; i++) {
            $a = $('<a>').attr('class', 'page-link').attr('href', '#commerce').text(i)

            $a.on('click', function() {
                var i = $(this).text()
                $('.page-item.active').removeClass('active')
                $(this).parent().addClass('active')
                showItems(Number(i))
                var maxPage = $('.page-item').last().prev().text()
                if (i == 1) $('.page-item.prev').addClass('disabled')
                else $('.page-item.prev').removeClass('disabled')
                if (i == maxPage) $('.page-item.next').addClass('disabled')
                else $('.page-item.next').removeClass('disabled')
            })

            var strActive = ((i == 1) ? ' active' : '')
            $li = $('<li>').attr('class', 'page-item' + strActive).append($a)
            $('#page-number').append($li)
        }

        $ra = $('<a>').attr('class', 'page-link').attr('href', '#commerce').text('»').on('click', function() {
                var i = Number($('.page-item.active').children().text()) + 1
                //console.log($('.page-item.active').prev().attr('class'))
                $next = $('.page-item.active').next()
                $curr = $('.page-item.active')
                $next.addClass('active')
                $curr.removeClass('active')
                var maxPage = $('.page-item').last().prev().text()
                if (i == 1) $('.page-item.prev').addClass('disabled')
                else $('.page-item.prev').removeClass('disabled')
                if (i == maxPage) $('.page-item.next').addClass('disabled')
                else $('.page-item.next').removeClass('disabled')
                showItems(i)
            })
        $rli = $('<li>').attr('class', 'page-item next').append($ra)
        $('#page-number').append($rli)
    }

    var loadItems = function() {
        // $loading = $('<div>').attr('class', 'spinner-border').attr('role', 'status')
        // $loading = $loading.append($('<span>').attr('class', 'sr-only'))
        // $('product-list').append($loading)
        $.get('https://js.kchen.club/B05505019/query', function(response) {
            if (response) {
                // 伺服器有回傳資料
                if (response.result) {
                    $('#product-list').empty();
                    // 資料庫有回傳資料
                    items = response.items

                    // 加了分頁效果，預設顯示第一頁
                    showItems(1)

                    // 顯示分頁和設定分頁的函式
                    $('#page').show()
                    newPage(items.length)

                } else {
                    $('#message').text('查無相關資料')
                    $('#dialog').modal('show')
                }
            } else {
                $('#message').text('伺服器出錯')
                $('#dialog').modal('show')
            }

            console.log(response)
        }, "json")
    }

    var sendItem = function() {
        $itemName = $('#itemName').val();
        $itemPrice = parseInt($('#itemPrice').val());
        $itemQuantity = parseInt($('#itemQuantity').val());
        $itemImgUrl = $('#itemImgUrl').val();

        $item = {
            item:{
                name:$itemName,
                price:$itemPrice,
                count:$itemQuantity,
                image:$itemImgUrl
            }
        }
        console.log($item);
        //console.log($itemPrice);
        //console.log($itemQuantity);
        //console.log($itemImgUrl);
        $.post('https://js.kchen.club/B05505019/insert', $item, function(response) {
            if (response) {
                // 伺服器有回傳資料
                if (response.result) {
                    console.log('succeeded to add item')
                } else {
                    console.log('failed to add item')
                }
            } else {
                console.log('respond error')
            }

            console.log(response)
            $('#itemName').val('')
            $('#itemPrice').val('')
            $('#itemQuantity').val('')
            $('#itemImgUrl').val('')
        }, "json")
    }

    $('#query').on('click', loadItems)

    $('#addItem').on('click', sendItem)

    loadItems();


})