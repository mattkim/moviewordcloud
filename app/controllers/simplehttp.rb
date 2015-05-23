class Simplehttp

  def initialize()
  end

  def head(url)
    uri = URI.parse(url)
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https', :verify_mode => OpenSSL::SSL::VERIFY_NONE) {|http|http.head(uri.path)}
    return res.code
  end

  def call(url)
    uri = URI.parse(url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https', :verify_mode => OpenSSL::SSL::VERIFY_NONE) {|http|http.request(req)}
    return res.body
  end

  def call_retry(url, key)
    curr_retries = 0

    while curr_retries < 3 do
      result = JSON.parse(call(url))
      if result[key]
        return result
      else
        sleep(1)
        curr_retries = curr_retries + 1
      end
    end

    return nil
  end

  #def call(url)
  #  uri = URI.parse(url)
  #  req = Net::HTTP::Get.new(uri.to_s)
  #  res = Net::HTTP.start(uri.host, uri.port) {|http|http.request(req)}
  #  return res.body
  #end

end

