require 'open-uri'

def tile_url(x, y, z)
  "https://map.playatlas.com/clusters/eupve1/tiles/#{z}/#{x}/#{y}.png"
end

tile_levels = {
  1 => 1,
  2 => 3,
  3 => 7,
  4 => 15,
  5 => 31,
  6 => 63
}

tile_levels.each do |z, max_x_y|
  x_y_range = (0..max_x_y).to_a
  x_y_range.each do |y|
    `mkdir -p docs/tiles/#{z}/#{y}`
  end
  x_y_range.each do |x|
    x_y_range.each do |y|
      if File.exist?("docs/tiles/#{z}/#{x}/#{y}.png")
        next
      elsif File.exist?("docs/map/tiles/#{z}_#{x}_#{y}.png")
        `cp docs/map/tiles/#{z}_#{x}_#{y}.png docs/tiles/#{z}/#{x}/#{y}.png`
      else
        File.write("docs/tiles/#{z}/#{x}/#{y}.png", open(tile_url(x,y,z)).read)
      end
    end
  end
end