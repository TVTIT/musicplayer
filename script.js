$(function()
{
    var playerTrack = $("#player-track");
	var bgArtwork = $('#bg-artwork');
	var bgArtworkUrl;
	var albumName = $('#album-name');
	var trackName = $('#track-name');
	var albumArt = $('#album-art'),
		sArea = $('#s-area'),
		seekBar = $('#seek-bar'),
		trackTime = $('#track-time'),
		insTime = $('#ins-time'),
		sHover = $('#s-hover'),
		playPauseButton = $("#play-pause-button"),
		i = playPauseButton.find('i'),
		tProgress = $('#current-time'),
		tTime = $('#track-length'),
		seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
		buffInterval = null, tFlag = false;
	
	var playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;
	
	var songs = [{
		artist: "Quân A.P",
		name: "Ai Là Người Thương Em",
		url: "Musics/Ai Là Người Thương Em - Quân A.P.mp3",
		picture: "https://photo-zmp3.zadn.vn/cover/b/1/2/d/b12d716b2c97575bbb278c2a49d45d61.jpg"
	},
	{
		artist: "Jack, K-ICM",
		name: "Bạc Phận",
		url: "Musics/Bạc Phận - Jack ft. K-ICM.flac",
		picture: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/4/2/5/3/425334e6f252b8c34d74d16177a5eb9d.jpg"
	},
	{
		artist: "Lê Bảo Bình",
		name: "Bước Qua Đời Nhau",
		url: "Musics/Bước Qua Đời Nhau - Lê Bảo Bình.flac",
		picture: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/0/c/1/7/0c17295b34844a5ad26ae2145d62b4fc.jpg"
	},
	{
		artist: "Jack, K-ICM",
		name: "Em Gì Ơi",
		url: "Musics/Em Gì Ơi - Jack x K-ICM.flac",
		picture: "https://static-zmp3.zadn.vn/skins/zma-2019/images/decuv2/emgioi.jpg"
	},
	{
		artist: "Jack (G5R)",
		name: "Hồng Nhan",
		url: "Musics/Hồng Nhan - Jack (G5R).flac",
		picture: "https://zmp3-photo-fbcrawler.zadn.vn/cover/3/2/7/f/327f68099674128289ba8a2e98232d68.jpg"
	},
	{
		artist: "Lê Bảo Bình",
		name: "Lá Xa Lìa Cành",
		url: "Musics/Lá Xa Lìa Cành - Lê Bảo Bình.flac",
		picture: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/d/2/a/8/d2a8fe2f80b1da9ed5ca4d3fc921446f.jpg"
	},
	{
		artist: "Đình Dũng",
		name: "Sai Lầm Của Anh",
		url: "Musics/Sai Lầm Của Anh - Đình Dũng.flac",
		picture: "https://avatar-nct.nixcdn.com/song/2019/10/21/4/6/1/e/1571623691373_640.jpg"
	},
	{
		artist: "Jack, K-ICM",
		name: "Sóng Gió",
		url: "Musics/Sóng Gió Jack x K-ICM.flac",
		picture: "https://static-zmp3.zadn.vn/skins/zma-2019/images/winner/songgio.jpg"
	},
	{
		artist: "Phan Duy Anh",
		name: "Từng Yêu",
		url: "Musics/Từng Yêu - Phan Duy Anh.flac",
		picture: "https://lh3.googleusercontent.com/proxy/zoSH09zZ_oAoJWRcLNUU7BmV7WmFwZNP9BW6UpzVYwarw20WrqLVf7ivpPMM3EaUVCwcO1LokhOdlO2kErKZS0BuN8Oh84_AXTB30UVY0jh1HX9KR5veSXlJH4_QgV05stQ"
	},
	{
		artist: "Nhật Phong, Đình Dũng",
		name: "Tường Quân Remix",
		url: "Musics/Tướng Quân Remix - Nhật Phong x DinhLong.flac",
		picture: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/b/8/8/a/b88a59c8e5116807f13cd49214dcf2f8.jpg"
	},
	{
		artist: "Jack, K-ICM",
		name: "Việt Nam Tôi",
		url: "Musics/Việt Nam Tôi - Jack x K-ICM.flac",
		picture: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/b/f/9/8bf90008a57a96e1f376e76a32c26f0c.jpg"
	}];
	
	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
	songs = shuffle(songs);

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
				albumArt.find('img').attr('src', currArtwork);
                audio.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','fas fa-play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
			selectTrack(1);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < songs.length) )
        {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');
			
			currAlbum = songs[currIndex].name;
            currTrackName = songs[currIndex].artist;
            currArtwork = songs[currIndex].picture;
			// albumArt.find('img').attr('src', currArtwork);

            audio.src = songs[currIndex].url;
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            $('#album-art img').prop('src', bgArtworkUrl);
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
			
        }
    }

    function initPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	initPlayer();
});
