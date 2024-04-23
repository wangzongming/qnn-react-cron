 
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import image from "@rollup/plugin-image"; 
import { terser } from "rollup-plugin-terser"; 
const fs = require("fs");
const path = require("path");

const production = !process.env.ROLLUP_WATCH;

if (production) {
	//删除dist文件夹
	console.log("删除dist文件夹中...");
	deleteFolder(path.resolve(__dirname, `dist`));
	console.log("删除dist文件夹完毕！开始打包...");
}

export default {
	input: "src/index.js",
	output: [
		{
			dir: "dist/cjs",
			format: "cjs",
			sourcemap: false,
		},
		{
			dir: "dist/es",
			format: "es",
			sourcemap: false,
		},
	],
	external: ["antd", "react", "react-dom"],
	moduleContext: (id) => {
		return "window";
	},
	plugins: [ 
		resolve(),
		external(),
		image(),
		url(),
		svgr(),
		postcss({
			use: [["less", { javascriptEnabled: true }]],
			// modules: true,
			// plugins: [
			// 	require("postcss-preset-env")({
			// 		autoprefixer: {
			// 			flexbox: "no-2009",
			// 		},
			// 		browsers: [
			// 			">0.15%",
			// 			"last 4 versions",
			// 			"Firefox ESR",
			// 			"not ie < 9", // React doesn't support IE8 anyway
			// 			"last 3 iOS versions",
			// 			"iOS 7",
			// 			"iOS >= 7",
			// 		],
			// 		stage: 3,
			// 	}),
			// ],
		}),
		babel({
			babelrc: false,
			exclude: [/\/core-js\//, "node_modules/**"],
			// babelHelpers:production ? "bundled" :"runtime",
			babelHelpers: "bundled",
			presets: [ 
				[
					"@babel/preset-env",
					{
						modules: false,
						corejs: 3,
						useBuiltIns: "usage",
						targets: {
							browsers: ["last 2 versions", "iOS >= 7", "Android >= 5"],
						},
					},
				],
				"@babel/preset-react",
			],
			plugins: [ 
				[
					"babel-plugin-named-asset-import",
					{
						loaderMap: {
							svg: {
								ReactComponent: "@svgr/webpack?-svgo![path]",
							},
						},
					},
				],
				"@babel/plugin-proposal-object-rest-spread",
				"@babel/plugin-syntax-dynamic-import",
				[
					"@babel/plugin-proposal-class-properties",
					{
						// loose: true,
					},
				],
				// "react-loadable/babel",
				"babel-plugin-transform-object-assign",
				["@babel/plugin-proposal-decorators", { legacy: true }],
				"@babel/plugin-proposal-optional-chaining",
				// [
				// 	"import",
				// 	{
				// 		libraryName: "antd",
				// 		libraryDirectory: "es",
				// 		// style: "css"
				// 		style: true,
				// 	},
				// 	"ant",
				// ],
			],
		}),
		commonjs(), 
		production && terser(), // minify, but only in production
	],
};

function deleteFolder(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			let curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) {
				deleteFolder(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}
