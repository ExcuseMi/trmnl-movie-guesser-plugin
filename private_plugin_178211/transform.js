function transform(input) {
  const settings = input.trmnl.plugin_settings.custom_fields_values;
  
  // Parse filter settings
  const maxRank = settings.max_rank_movies ? parseInt(settings.max_rank_movies) : null;
  const genreInclusions = settings.genre_inclusions || [];
  const genreExclusions = settings.genre_exclusions || [];
  const minYear = settings.min_year ? parseInt(settings.min_year) : null;
  const maxYear = settings.max_year ? parseInt(settings.max_year) : null;
  
  // Handle translations
  const allTranslations = input.IDX_1;
  let userLocale = input.trmnl.user.locale || "en";
  
  // Override for specific user
  if (input.trmnl.user.id === 6458) {
    userLocale = "en";
  }
  
  // Extract first part of locale if it's two-part (e.g., "en_UK" -> "en")
  if (userLocale.includes("_")) {
    userLocale = userLocale.split("_")[0];
  }
  
  // Get translations for user's locale, fallback to English
  const translations = allTranslations[userLocale] || allTranslations["en"];
  
  // Filter movies based on all criteria
  let filteredMovies = input.IDX_0.data.filter(movie => {
    // Filter by rank (movie position in array)
    if (maxRank !== null) {
      const movieRank = input.IDX_0.data.indexOf(movie) + 1;
      if (movieRank > maxRank) return false;
    }
    
    // Filter by year
    const movieYear = parseInt(movie.year);
    if (minYear !== null && movieYear < minYear) return false;
    if (maxYear !== null && movieYear > maxYear) return false;
    
    // Filter by genre inclusions (must match at least one included genre)
    if (genreInclusions.length > 0) {
      const hasIncludedGenre = movie.genres.some(genre => 
        genreInclusions.map(g => g.toLowerCase()).includes(genre.toLowerCase())
      );
      if (!hasIncludedGenre) return false;
    }
    
    // Filter by genre exclusions (must not match any excluded genre)
    if (genreExclusions.length > 0) {
      const hasExcludedGenre = movie.genres.some(genre => 
        genreExclusions.map(g => g.toLowerCase()).includes(genre.toLowerCase())
      );
      if (hasExcludedGenre) return false;
    }
    
    // Movie must have at least one image
    if (!movie.images || movie.images.length === 0) return false;
    
    return true;
  });
  
  // Select random movie from filtered results
  const randomMovie = filteredMovies.length > 0 
    ? filteredMovies[Math.floor(Math.random() * filteredMovies.length)]
    : null;
  
  return {
    movie: randomMovie,
    translations: translations
  };
}