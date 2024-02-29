const nextConfig = {
  reactStrictMode: true
}

module.exports = {
  ...nextConfig,
  // 他の設定...

  // Next.jsのビルドアウトプットをpublicディレクトリに移動する設定
  distDir: 'public/_next'
}
