const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    let config = {
        entry: {
            app: './src/index.ts',
            'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'public',
                        to: './[path][name][ext]',
                        globOptions: {
                            ignore: ['**/index.html']
                        }
                    }
                ]
            })
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        devServer: {
            static: './public'
        }
    };

    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
        config.devServer = {
            static: './public',
        }
    }

    return config;
}