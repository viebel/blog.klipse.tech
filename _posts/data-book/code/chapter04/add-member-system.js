class System {
    addMember(member) {
        var librarySnapshot = SystemData.get();
        var nextLibary = Library.addMember(librarySnapshot, member);
        SystemData.commit(librarySnapshot, nextLibrary);
    }
}
