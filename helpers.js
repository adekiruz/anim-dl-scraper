const r = require("request");
const cheerio = require("cheerio");

const getAnimeList = () => {
  return new Promise(resolve => {
    const listEpisodeLinks = [];

    r.get("https://www.samehadaku.tv/anime-list/", (err, res, body) => {
      if (err) {
        console.log(err);
        return false;
      }

      const $ = new cheerio.load(body);
      const itemContainer = $(".post a");

      itemContainer.each(function() {
        const link = $(this).attr("href");
        const linkTitle = $(this).text();
        // eliminasi link yang tidak mengandung 'samehadaku.tv
        // eliminasi link yang mengandung 'manga', 'komik', atau yang mengandung angka tahun (itu berarti blog post)
        if (
          link.match(/samehadaku.tv/) &&
          !link.match(/manga|komik|[0-9]{4}/)
        ) {
          // eliminsasi link yang tidak mengandung 'tag' atau 'category'
          // yang selanjutnya akan dimapping dulu
          if (link.match(/tag|category/)) {
            listEpisodeLinks.push({ title: linkTitle, link: link });
          } else {
            // menambahkan string 'category' agar menuju ke list episode
            const splitLink = link.split("/");
            splitLink.splice(3, 0, "category");
            const categoryLink = splitLink.join("/");

            listEpisodeLinks.push({ title: linkTitle, link: categoryLink });
          }
        }
      });
    }).on("end", () => resolve(listEpisodeLinks));
  });
};

const getListEpisode = choosenAnimeLink => {
  return new Promise(resolve => {
    const episodeLinks = [];

    r.get(choosenAnimeLink, (err, res, body) => {
      if (err) {
        console.log(err);
        return false;
      }

      const $ = cheerio.load(body);
      const containerLink = $(".post-item .post-title a");

      containerLink.each(function() {
        const title = $(this).text();
        const link = $(this).attr("href");

        if (!link.match(/opening|ending/)) {
          episodeLinks.push({
            title: title,
            link: link
          });
        }
      });
    }).on("end", () => resolve(episodeLinks));
  });
};

const getDownloadLink = choosenEpisodeLink => {
  return new Promise(resolve => {
    const links = [];
    const resolutions = [];
    let mkvLinks = [];
    // let mp4Links = {};

    r.get(choosenEpisodeLink, (err, res, body) => {
      if (err) {
        console.log(err);
        return false;
      }

      const $ = cheerio.load(body);
      const containerLink = $(".download-eps");

      containerLink.each(function() {
        const extension = $(this)
          .prev()
          .text();
        const downloadLinks = [];

        $(this)
          .find("ul")
          .find("li")
          .each(function() {
            // 360p, 480p, 720p, 1080p, dll
            const resolutionText = $(this).find("strong");
            // GD, CU, ZS, RC, MU, dll
            const webSources = $(this).find("a");

            resolutionText.each(function() {
              const sourceLinks = [];

              webSources.each(function() {
                sourceLinks.push({
                  source: $(this).text(),
                  link: $(this).attr("href")
                });
              });

              downloadLinks.push({
                resolution: $(this)
                  .text()
                  .trim(),
                sources: sourceLinks
              });
            });
          });

        links.push({ extension: extension, download_links: downloadLinks });
      });

      // MKV
      // containerLink
      //   .eq(0)
      //   .find("ul")
      //   .find("li")
      //   .each(function() {

      //   });

      // containerLink
      //   .eq(0)
      //   .find("ul")
      //   .each(function() {
      //     $(this)
      //       .find("strong")
      //       .each(function() {
      //         let downloadSource = {};

      //         containerLink
      //           .eq(0)
      //           .find("ul")
      //           .find("span > a")
      //           .each(function() {
      //             downloadSource[$(this).text()] = $(this).attr("href");
      //           });

      //         mkvLinks[
      //           $(this)
      //             .text()
      //             .trim()
      //         ] = downloadSource;
      //       });
      //   });

      // MP4
      // containerLink
      //   .eq(1)
      //   .find("ul")
      //   .each(function() {
      //     $(this)
      //       .find("strong")
      //       .each(function() {
      //         let downloadSource = {};

      //         containerLink
      //           .eq(1)
      //           .find("ul")
      //           .find("span > a")
      //           .each(function() {
      //             downloadSource[$(this).text()] = $(this).attr("href");
      //           });

      //         mp4Links[
      //           $(this)
      //             .text()
      //             .trim()
      //         ] = downloadSource;
      //       });
      //   });
      // }).on("end", () => resolve([{ mkv: mkvLinks }, { mp4: mp4Links }]));
    }).on("end", () => resolve(links));
  });
};

module.exports = { getAnimeList, getListEpisode, getDownloadLink };
