angular.module( 'angularlife', [] )

.factory( 'ManageLife', function( $interval )
{
	var a = {
		play	: false,
		w		: 10,
		h 		: 10,
		grade 	: new Array()
	};

	// Constroi a grade
	a.buildGrade = function()
	{
		for( r = 0; r < a.h; r++ ) // rows
		{
			a.grade[r] = [];
			for( c = 0; c < a.w; c++ ) // columns
			{
				a.grade[ r ][ c ] = false;
			}
		}
	};

	a.changeCell = function( row, column )
	{
		var nVizinhos 	= 0,
			status 		= a.isLive( row, column ),
			rUp 		= row - 1,
			rCenter		= row,
			rDown		= row + 1,
			cLeft		= column - 1,
			cCenter		= column,
			cRight		= column + 1,
			loopArr		= new Array( 
				[rUp, cLeft], 		[rUp, cCenter], 	[rUp, cRight],
				[rCenter, cLeft], 	/*[rCenter, cCenter],*/ [rCenter, cRight],
				[rDown, cLeft], 	[rDown, cCenter], 	[rDown, cRight]
			);
		
		for( var item in loopArr )
		{
			var r = loopArr[item][0],
				c = loopArr[item][1];

			if ( 
				r >= 0 && r < a.h
				&& c >= 0 && c < a.w
				&& a.isLive( r, c )
			) {
				nVizinhos++
			}
		}

		if ( a.isLive( row, column ) )
		{
			if ( nVizinhos < 2 || nVizinhos > 3 )
				status = false;
		}
		if ( ! a.isLive( row, column ) )
			if ( nVizinhos == 3 )
				status = true;

		return status;
	};

	a.startSequence = function()
	{
		a.play = ! a.play ;

		if ( a.play )
		{ 
			bootAnimate = $interval( function()
			{
				a.animate()
			}, 200 );
		}else {
			$interval.cancel( bootAnimate )
		}
		
			
	};

	a.animate = function()
	{
		console.log( 'anima' );
		var cellTemp = new Array();

		for( r = 0; r < a.h; r++ ) // rows
		{
			cellTemp[r] = [];
			for( c = 0; c < a.w; c++ ) // columns
			{
				cellTemp[r][c] = a.changeCell( r, c );
			}
		}
		a.grade = cellTemp;
	}

	a.morphBlock = function( r, c )
	{
		a.grade[ r ][ c ] = ! a.grade[ r ][ c ];
	}

	a.itemsRow = function()
	{
		return a.grade;
	}

	a.itemsColumn = function( key )
	{
		return a.grade[ key ];
	}

	a.isLastColumn = function( rowKey, columnKey )
	{
		return columnKey + 1 == a.grade[ rowKey ].length;
	}
	a.isLive = function( rowKey, columnKey )
	{
		return a.grade[rowKey][columnKey];
	}

	return a;
})

.controller( 'LifeCtrl', function( $scope, ManageLife )
{
	$scope.a = ManageLife;
	$scope.a.buildGrade();
});