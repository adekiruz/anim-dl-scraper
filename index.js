const prompt = require("prompts");
const figlet = require("figlet");

const { getAnimeList, getListEpisode, getDownloadLink } = require("./helpers");

// clean the console
process.stdout.write("\033c");
// (async () => {
//   const link = await getDownloadLink(
//     "https://www.samehadaku.tv/bem-episode-3/"
//   );
//   console.log(link);
// })();

// print figlet text
figlet("Link Download Scraper", (err, text) => {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }

  console.log(text);
  console.log("Created by: adekiruz", "\n");

  (async () => {
    const askWebsite = await prompt({
      type: "select",
      name: "website",
      message: "Pilih Website:",
      choices: [
        { title: "Samehadaku", value: "samehadaku.tv" },
        { title: "Yang lain..", value: "another" }
      ]
    });

    if (askWebsite.website === "samehadaku.tv") {
      const listEpisodeLinks = await getAnimeList();

      const askAnime = await prompt({
        type: "autocomplete",
        name: "anime",
        message: "Pilih Anime:",
        choices: listEpisodeLinks.map(item => ({
          title: item.title,
          value: item.link
        })),
        limit: 20
      });

      const episodeLinks = await getListEpisode(askAnime.anime);

      const askEpisode = await prompt({
        type: "select",
        name: "episode",
        message: "Pilih Episode:",
        choices: episodeLinks.map(item => ({
          title: item.title,
          value: item.link
        })),
        limit: 20
      });

      const downloadLinks = await getDownloadLink(askEpisode.episode);

      const askExtension = await prompt({
        type: "select",
        name: "extension",
        message: "Pilih Ekstensi:",
        choices: downloadLinks.map(item => ({
          title: item.extension,
          value: item.download_links
        }))
      });

      const askResolution = await prompt({
        type: "select",
        name: "resolution",
        message: "Pilih Resolusi:",
        choices: askExtension.extension.map(item => ({
          title: item.resolution,
          value: item.sources
        }))
      });

      const askDownloadSource = await prompt({
        type: "select",
        name: "download_link",
        message: "Pilih Link Download",
        choices: askResolution.resolution.map(item => ({
          title: item.source,
          value: item.link
        }))
      });

      // console.log(askDownloadSource);

      console.log("Link Download:", askDownloadSource.download_link);

      // const askDownloadLink = await prompt({
      //   type: "select",
      //   name: "resolution",
      //   message: "Pilih Resolusi:",
      //   choices: downloadLinks.map(item => ({
      //     title: item.title,
      //     value: item.link
      //   })),
      //   limit: 20
      // });

      // console.log(askDownloadLink);
    } else {
      console.log("Fitur ini belum tersedia :P");
    }
  })();
});
