"use strict";

var webpack = require("webpack");
var path = require("path");

var mainEntryPoint = path.resolve(__dirname, "js", "explore.js");
var distDirectory = path.resolve(__dirname, "dist");
var publicDirectory = path.resolve(__dirname, "public");

var config = {
  entry: {
    "explore": mainEntryPoint
  },

  output: {
    path: distDirectory,
    filename: "[name].js"
  },

  devServer: {
    contentBase: publicDirectory
  },
  devtool: "source-map"
};

module.exports = config;
