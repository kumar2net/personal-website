PUML_FILES := $(wildcard docs/reco-architecture-*.puml)
OUT_DIR := docs

.PHONY: puml-svg puml-png

define HAS_PLANTUML
  @command -v plantuml >/dev/null 2>&1
endef

puml-svg:
	@if $(HAS_PLANTUML); then \
	  echo "Rendering with local plantuml to SVG"; \
	  plantuml -tsvg $(PUML_FILES); \
	else \
	  echo "Local plantuml not found; using Docker"; \
	  docker run --rm -v "$(PWD)":/workspace plantuml/plantuml -tsvg $(PUML_FILES); \
	fi

puml-png:
	@if $(HAS_PLANTUML); then \
	  echo "Rendering with local plantuml to PNG"; \
	  plantuml -tpng $(PUML_FILES); \
	else \
	  echo "Local plantuml not found; using Docker"; \
	  docker run --rm -v "$(PWD)":/workspace plantuml/plantuml -tpng $(PUML_FILES); \
	fi




