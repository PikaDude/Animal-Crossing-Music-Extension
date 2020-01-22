// So long as there is either no object
// loopTimes[thisGame][thisHour][thisWeather], when the extension
// plays music for game "thisGame", hour "thisHour" and weather "thisWeather"
// it will loop using these manually set times.

// If you add a new game to loopTimes, you don't need
// to add all 24 sets of times at once. If you only add a few,
// it won't introduce any bugs with the other hour tracks.

const loopTimes = {
	"animal-crossing": {
		sunny: {
			0: {
				start: 0.000,
				end: 125.628
			},
			1: {
				start: 3.925,
				end: 133.740
			},
			2: {
				start: 0.000,
				end: 175.674
			},
			3: {
				start: 0.416,
				end: 177.770
			},
			4: {
				start: 0.000,
				end: 138.628
			},
			5: {
				start: 0.000,
				end: 186.119,
			},
			6: {
				start: 0.396,
				end: 165.777,
			},
			7: {
				start: 0.000,
				end: 137.524,
			},
			8: {
				start: 0.000,
				end: 142.308,
			},
			9: {
				start: 2.700,
				end: 130.613,
			},
			10: {
				start: 0.000,
				end: 116.657,
			},
			11: {
				start: 0.000,
				end: 142.220,
			},
			12: {
				start: 0.000,
				end: 109.480,
			},
			13: {
				start: 0.000,
				end: 144.945,
			},
			14: {
				start: 0.000,
				end: 130.274,
			},
			15: {
				start: 0.940,
				end: 82.985,
			},
			16: {
				start: 0.000,
				end: 130.280,
			},
			17: {
				start: 10.460,
				end: 136.090,
			},
			18: {
				start: 0.000,
				end: 134.920,
			},
			19: {
				start: 0.000,
				end: 127.740,
			},
			20: {
				start: 0.000,
				end: 120.780,
			},
			21: {
				start: 0.000,
				end: 153.528,
			},
			22: {
				start: 1.240,
				end: 101.750,
			},
			23: {
				start: 0.000,
				end: 80.386,
			},
		},
		snowing: {
			0: {
				start: 0.000,
				end: 125.628
			},
			1: {
				start: 3.925,
				end: 133.740
			},
			2: {
				start: 0.000,
				end: 175.674
			},
			3: {
				start: 0.416,
				end: 177.770
			},
			4: {
				start: 0.000,
				end: 138.628
			},
			5: {
				start: 0.000,
				end: 186.119,
			},
			6: {
				start: 0.396,
				end: 165.777,
			},
			7: {
				start: 0.000,
				end: 137.524,
			},
			8: {
				start: 0.000,
				end: 142.308,
			},
			9: {
				start: 2.700,
				end: 130.613,
			},
			10: {
				start: 0.000,
				end: 116.657,
			},
			11: {
				start: 0.000,
				end: 142.220,
			},
			12: {
				start: 0.000,
				end: 109.480,
			},
			13: {
				start: 0.000,
				end: 144.945,
			},
			14: {
				start: 0.000,
				end: 130.274,
			},
			15: {
				start: 0.940,
				end: 82.985,
			},
			16: {
				start: 0.000,
				end: 130.280,
			},
			17: {
				start: 10.460,
				end: 136.090,
			},
			18: {
				start: 0.000,
				end: 134.920,
			},
			19: {
				start: 0.000,
				end: 127.740,
			},
			20: {
				start: 0.000,
				end: 120.780,
			},
			21: {
				start: 0.000,
				end: 153.528,
			},
			22: {
				start: 1.240,
				end: 101.750,
			},
			23: {
				start: 0.000,
				end: 80.386,
			}
		}
	},
	"wild-world": {
		sunny: {
			0: {
				start: 10.370,
				end: 108.830
			},
			1: {
				start: 12.970,
				end: 103.780
			},
			2: {
				start: 7.800,
				end: 144.785
			},
			3: {
				start: 12.118,
				end: 92.120
			},
			4: {
				start: 4.405,
				end: 51.225
			},
			5: {
				start: 0.000,
				end: 147.695
			},
			6: {
				start: 0.610,
				end: 78.985
			},
			7: {
				start: 4.670,
				end: 84.670
			},
			8: {
				start: 0.000,
				end: 53.335
			},
			9: {
				start: 0.490,
				end: 68.495
			},
			10: {
				start: 3.540,
				end: 81.380
			},
			11: {
				start: 0.620,
				end: 102.765
			},
			12: {
				start: 0.000,
				end: 170.660
			},
			13: {
				start: 5.615,
				end: 101.630
			},
			14: {
				start: 13.330,
				end: 119.985
			},
			15: {
				start: 0.000,
				end: 73.132
			},
			16: {
				start: 8.620,
				end: 100.520
			},
			17: {
				start: 0.000,
				end: 79.990
			},
			18: {
				start: 1.850,
				end: 109.850
			},
			19: {
				start: 1.300,
				end: 91.300
			},
			20: {
				start: 1.885,
				end: 149.620
			},
			21: {
				start: 1.840,
				end: 97.860
			},
			22: {
				start: 0.000,
				end: 181.600
			},
			23: {
				start: 0.000,
				end: 151.590
			},
		}
	}
}