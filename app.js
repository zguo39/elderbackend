const express = require('express')
const mysql = require("mysql")
// const escape = require('escape')
const {
	responseInfo
} = require('./utils/status')
const app = express()

// create server and listen port
const port = process.env.PORT || 8888;
// const port = process.env.PORT

app.listen(port, function() {
	console.log(`USING: ${port}`)
});

// connect to database
app.use(express.static('./static'))
const db_config = {
	//host: "35.224.175.92",
	host: "34.70.91.145",
	// host:"te23-eldercare.mysql.database.azure.com",
	user: 'root',
	// user:"te23eldercare@te23-eldercare",
	password: "te23-123",
	port: "3306",
	database: "te23_eldercare"
}

const connect = mysql.createConnection(db_config)

connect.connect(function(err) {
	if (err) {
		console.log(`mysql connection fail: ${err}`)
	} else {
		console.log('mysql connected')
	}
})

// middle instruction, before request
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

// api get game category
app.get('/api/game/category', async (req, res) => {
	let sqlquery = "Select distinct category from master_games;"
	try {
		data = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		responseInfo(res, {
			data
		})
	} catch (e) {
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}
})

// api get game
app.get('/api/game', async (req, res) => {
	
	let sqlquery = "Select * from master_games"
	try {
		data = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		responseInfo(res, {
			data
		})
	} catch (e) {
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}	
})

// api get video
app.get('/api/type', async (req, res) => {
	let {
		type,
	} = req.query
	let data
	
	let sqlquery = "Select `Core Areas`,`Exercise Name`,Description,`Youtube Link`,`Exercise Precautions` from exercise where `Core Areas` = '" + type +"';"
	try {
		data = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		responseInfo(res, {
			data
		})
	} catch (e) {
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}	
})

// condition
app.get('/api/condition', async (req, res) => {
	let {
		condition,
	} = req.query
	let data
	condition = condition.split(',')

	let sqlquery = "Select `Core Areas`,`Exercise Name`,Description,`Youtube Link`,`Exercise Precautions` from exercise where `Health Condition` = '"
	
	for(let i = 0; i < condition.length; i++) {
		if(i == 0) {
			sqlquery += `${condition[i]}'`;
		}else {
			sqlquery += " or `Health Condition` = '" + condition[i] + "'"
		}
	}
	
	try {
		data = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		responseInfo(res, {
			data
		})
	} catch (e) {
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}	
})

// api get request,
app.get('/api/daily', async (req, res) => {
	let {
		age,
		gender,
	} = req.query
	let data
	
	let sqlquery = "select `Protein in g`, `Vitamin A in ug`, `Vitamin C in mg`, `Calcium in mg`, `Folate in ug`, `Potassium in mg`, `Iron in mg`, `Zinc in mg`, `Vitamin B6 in mg`, `Vitamin B12 in ug`, `Magnesium in mg` from master_nutrient where Gender='" + gender + "' and Age=" + age +""

	try {
		data = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		responseInfo(res, {
			data
		})
	} catch (e) {
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}	
})

// get distinct category list
app.get('/api/category', async (req, res) => {
	let data = []
	let arr
	let sqlquery = "select DISTINCT `Food Category` from master_food order by `Food Category` asc"
	try{
		arr = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		arr.forEach(item => {
			data.push(item["Food Category"])
		})
		responseInfo(res, {
			data
		})
	}catch(e){
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}
})

// get food recommendation
app.get('/api/recm', async (req, res) => {
	let { veg, nutrient } = req.query
	let data
	let sqlquery
	let arg = veg == 'veg' ? 'Vegeterian' : 'Non-vegeterian'
	switch(arg){
		case 'Vegeterian':
		sqlquery = "select * from food_recommendation WHERE Nutrient ='"+ nutrient +"' and `Food Habit` ='" + arg +"'"
		break;
		case 'Non-vegeterian':
		sqlquery = "select * from food_recommendation WHERE Nutrient ='"+ nutrient +"'"
	}

	try{
		data = await new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
		responseInfo(res, {
			data
		})
	}catch(e){
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}
})

// get food nutrient
app.get('/api/meal', async (req, res) => {
	let {
			food
	} = req.query
	let data
	let parr = []
	// get the data from the database
	// console.log(sqlquery)

	food = food.split(',')
	// console.log(food)
	food.forEach(item => {
		// test query
		// let sqlquery = "select * from master_food where `Food Name` Like '%" + item + "%'"
		let sqlquery = "select `Food Name`, `Protein in g`, `Vitamin A retinol equivalents in ug`, `Vitamin C in mg`, `Calcium (Ca) in mg`, `Folate natural in ug`, `Potassium (K) in mg`, `Food Category`, quantity, `Zinc (Zn) in mg` as `Zinc in mg`, `Pyridoxine (B6) in mg` as `Vitamin B6 in mg`, `Iron (Fe) in mg` as `Iron in mg`, `Cobalamin (B12) in ug` as `Vitamin B12 in ug`, `Magnesium (Mg) in mg` as `Magnesium in mg` from master_food where `Food Category` Like '%" + item + "%'"
		// console.log(sqlquery)
		parr.push(new Promise((resolve, reject) => {
			connect.query(sqlquery, function(err, result) {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		}))
	})

	try {
		data = await Promise.all(parr)
		responseInfo(res, {
			data
		})
	} catch (e) {
		//TODO handle the exception
		responseInfo(res, {
			code: 1,
			codeText: e
		})
	}

})
// app.post()
// static file request

// app.use(express.static(path.join(__dirname, './static')));
// error
app.use((req, res) => {
	res.status(404).send({
		code: 1,
		codeText: 'not found'
	})
})
